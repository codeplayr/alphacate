'use strict';

module.exports = {
	/**
	* https://stackoverflow.com/a/11315692
	*/
	has( object, key ){
		return object ? hasOwnProperty.call(object, key) : false;
	},

	/**
	* https://stackoverflow.com/a/26206246
	*/
	extends(){
		let args = Array.prototype.slice.call(arguments);
		args.unshift( {} );
		return Object.assign.apply(null, Array.prototype.slice.call(arguments));
	},

}
