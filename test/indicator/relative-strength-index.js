'use strict';

const assert = require('chai').assert;
const RSI = require('./../../lib/indicator/relative-strength-index');

describe('Relative Strength Index', function(){

	let data = [
		44.34,
		44.09,
		44.15,
		43.61,
		44.33,
		44.83,
		45.10,
		45.42,
		45.84,
		46.08,
		45.89,
		46.03,
		45.61,
		46.28,
		46.28,
		46.00,
		46.03,
		46.41,
		46.22,
		45.64,
		46.21,
		46.25,
		45.71,
	];

	let runTest = async function( data, options, expectedResultLength ) {
		let rsi = new RSI( options );
		rsi.setValues( data );

		let result = await rsi.calculate();

		assert.isArray( result );
		assert.isTrue( result.length ==  expectedResultLength  );

		let item_14 = result[ 13 ];

		assert.isNull( item_14.avg_gain );
		assert.isNull( item_14.avg_loss );
		assert.isNull( item_14.rs );
		assert.isNull( item_14.rsi );

		let last_item  = result[result.length - 1 ];

		assert.isTrue( last_item.price == 45.71 );
		assert.isTrue( last_item.gain == 0 );
		assert.closeTo( last_item.avg_gain, 0.2, 0.1 );
		assert.closeTo( last_item.loss, 0.5, 0.05 );
		assert.closeTo( last_item.rs, 1.3, 0.1 );
		assert.closeTo( last_item.rsi, 58, 1 );
	}

	let runTest2 = async function( data, options, expectedResultLength ) {
		let rsi = new RSI( options );
		rsi.setValues( data );

		let result = await rsi.calculate();

		assert.isArray( result );
		assert.isTrue( result.length ==  expectedResultLength  );

		let last_item  = result[result.length - 1 ];

		assert.isTrue( last_item.price == 45.71 );
		assert.isTrue( last_item.gain == 0 );
		assert.closeTo( last_item.avg_gain, 0.2, 0.1 );
		assert.closeTo( last_item.loss, 0.5, 0.05 );
		assert.closeTo( last_item.rs, 1.3, 0.1 );
		assert.closeTo( last_item.rsi, 58, 1 );
	}	

	it('should calculate correctly and return results', () => {
		runTest( [...data], {periods: 14, sliceOffset: false, lazyEvaluation: true}, data.length );
	});

	it('should calculate correctly and return results without offset', () => {
		let opts = {periods: 14, sliceOffset: true, lazyEvaluation: true};
		runTest2( [...data], opts, data.length - opts.periods  ); 
	});

	it('should calculate correctly with ranges and return results', () => {
		let dataCopy = [...data];
		dataCopy.unshift(40.11);
		dataCopy.push(45.99);
		runTest( dataCopy,  {periods: 14, sliceOffset: false, startIndex: 1, endIndex: dataCopy.length - 2, lazyEvaluation: true }, dataCopy.length - 2 );  
	});

	it('should throw error on invalid options', () => {		
		let runTest = async ( options ) => {
			let failed = false;
			try{
				let rsi = new RSI( options );
				rsi.setValues( data );
				let results = await rsi.calculate();
			}catch( err ){
				if(err.name == 'Error')	failed = true;
			}
			return failed;
		};

		(async () => {
			var b = false;
			// timeperiod above array length
			b = await runTest(  {endIndex: data.length - 1, periods: data.length, lazyEvaluation: true } );
			assert.isTrue( b )

			// focusIndex above array length
			b = await runTest(  {endIndex: data.length, periods: 14, lazyEvaluation: true } );
			assert.isTrue( b )
		})();

	});


});
