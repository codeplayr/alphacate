'use strict';

const assert = require('chai').assert;
const BB = require('./../../lib/indicator/bollinger-bands');

describe('Boilinger Bands', () => {

	let data = [25.5, 26.75, 27.0, 26.5, 27.25];
	let data_2 = [25.5, 26.75, 27.0, 26.5, 27.25, 28.1];
	
	it('should calculate correctly and return result', () => {
		let runTest = async ( periods, values, expectedResult ) => {
			let opts = { periods, lazyEvaluation: true, sliceOffset: true };
			let bb = new BB( opts );
			bb.setValues( values );
			let results = await bb.calculate();

			assert.isArray( results )
			assert.isTrue( values.length - opts.periods + 1  == results.length );

			expectedResult.forEach( ( expected, idx ) => {
				let resultItem = results[ idx ];   
				assert.isObject( resultItem );
				assert.containsAllKeys( resultItem, ['upper', 'middle', 'lower', 'price'] );
				assert.closeTo( resultItem.upper, expected.u, 0.1 );
				assert.closeTo( resultItem.middle, expected.m, 0.1 );
				assert.closeTo( resultItem.lower, expected.l, 0.1 );
				assert.isTrue( resultItem.price == values[ periods - 1 + idx ] );
			});
		};

		let arr = [
			{
				p: 5, v: data, e: [
					{ m:26.6, u:27.8, l:25.4 }
				]
			},
			{
				p: 5, v: data_2, e: [
					{ m:26.6, u:27.8, l:25.4 },
					{ m:27.1, u:28.2, l:26.0 }
				]
			},
		];

		for( let i=0; i<arr.length; i++ ){
			let item = arr[ i ];
			runTest(item.p, item.v, item.e );
		}

	});



	it('should calculate correctly and return results with offset', () => {
		let runTest = async ( periods, values, expectedResult ) => {
			let opts = { periods, sliceOffset: false, lazyEvaluation: true };
			let bb = new BB( opts );
			bb.setValues( values );
			let results = await bb.calculate();

			assert.isArray( results )
			assert.isTrue( values.length == results.length );

			expectedResult.forEach( ( expected, idx ) => {
				let resultItem = results[idx];
				assert.containsAllKeys( resultItem, ['upper', 'middle', 'lower', 'price'] );
				assert.closeTo( resultItem.upper, expected.u, 0.1 );
				assert.closeTo( resultItem.middle, expected.m, 0.1 );
				assert.closeTo( resultItem.lower, expected.l, 0.1 );
				assert.isTrue( resultItem.price == values[ idx ] );
			});
		};
 
		let arr = [
			{
				p: 5, v: data, e: [
					{ m:0, u:0, l:0 },
					{ m:0, u:0, l:0 },
					{ m:0, u:0, l:0 },
					{ m:0, u:0, l:0 },
					{ m:26.6, u:27.8, l:25.4 }
				]
			}
		];

		for( let i=0; i<arr.length; i++ ){
			let item = arr[i];
			runTest( item.p, item.v, item.e );
		}
	});


	it('should throw error on invalid options', () => {
		function runTest( opts ){
			let bb = new BB( opts );
			bb.setValues( data );
			assert.throws( () => bb.calculate(), Error );
		};

		[
			{ periods: data.length + 1 },
			{ startIndex: data.length + 1 },
			{ endIndex: data.length + 1 },
			{ periods: 'foo' },
			{ startIndex: data.length, endIndex: 0 },
		].forEach( ( option ) => runTest( option )  );

	});	

});
