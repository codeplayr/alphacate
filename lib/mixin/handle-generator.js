'use strict';

const convertHrtime = require('convert-hrtime');
const TypeUtil = require('./../utils/type');

module.exports = {

	_handleGenerator( gen ){
		if( ! this._options.lazyEvaluation ) return gen.next().value;
		return new Promise( ( resolve, reject ) => {
			let results = [];
			let maxTickDuration = this._options.maxTickDuration || 10;

			(function handler(){
				let startHRTime = process.hrtime();
				let obj = gen.next();
				let nextCall = false;
				while( ! obj.done ){
					results.push( obj.value );
					let {milliseconds} = convertHrtime(process.hrtime(startHRTime));
					if( milliseconds < maxTickDuration ){
						obj = gen.next();
					}else{
						nextCall = true;
						break;
					}
				}
				(nextCall) ? setImmediate( () => handler() ) : resolve( results );
			})();
		});
	},

	_handleAsyncGenerator( gen ){
		return new Promise( (resolve, reject) => {
			let results = [];
			let maxTickDuration = this._options.maxTickDuration || 0.5;

			(function handler(){
				let startHRTime = process.hrtime();
				(async function loop(){
					try{
						let obj = await gen.next();
						if( ! obj.done ){
							results.push( obj.value );
							let {milliseconds} = convertHrtime(process.hrtime(startHRTime));
							if( milliseconds < maxTickDuration ) loop();
							else setImmediate( () => handler() );
						}
						else{
							if( ! TypeUtil.isUndefined( obj.value ) ){
								results.push( obj.value );
							}
							resolve(results);
						}
					}
					catch(err){
						reject( err );
					}
				})();
			})();
		});

	},
};
