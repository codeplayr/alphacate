'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const BB = require('./../../lib/indicator/bollinger-bands');

describe('Boilinger Bands', function(){

	let data = [25.5, 26.75, 27.0, 26.5, 27.25];
	let data_2 = [25.5, 26.75, 27.0, 26.5, 27.25, 28.1];

	it('should calculate correctly and return result', () => {
		function runTest( periods, values, expectedResult ){
			let opts = { periods };
			let bb = new BB( opts );
			bb.setValues( values );
			let results = bb.calculate();

			assert.containsAllKeys( results, ['upper', 'middle', 'lower', 'price'] );
			assert.isArray( results.middle )
			assert.isTrue( values.length - opts.periods + 1  == results.middle.length );

			expectedResult.forEach( ( expected, idx ) => {
				assert.closeTo( results.upper[idx], expected.u, 0.1 );
				assert.closeTo( results.middle[idx], expected.m, 0.1 );
				assert.closeTo( results.lower[idx], expected.l, 0.1 );
				assert.isTrue( results.price[idx] == values[ periods - 1 + idx ] );
			});
		};

		[
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
		].forEach( (item) => runTest( item.p, item.v, item.e ) );
	});

	it('should calculate correctly and return results with offset', () => {
		function runTest( periods, values, expectedResult ){
			let opts = { periods, sliceOffset: false };
			let bb = new BB( opts );
			bb.setValues( values );
			let results = bb.calculate();

			assert.containsAllKeys( results, ['upper', 'middle', 'lower', 'price'] );
			assert.isArray( results.middle )
			assert.isTrue( values.length == results.middle.length );

			expectedResult.forEach( ( expected, idx ) => {
				assert.closeTo( results.upper[idx], expected.u, 0.1 );
				assert.closeTo( results.middle[idx], expected.m, 0.1 );
				assert.closeTo( results.lower[idx], expected.l, 0.1 );
				assert.isTrue( results.price[idx] == values[ idx ] );
			});
		};
 
		[
			{
				p: 5, v: data, e: [
					{ m:0, u:0, l:0 },
					{ m:0, u:0, l:0 },
					{ m:0, u:0, l:0 },
					{ m:0, u:0, l:0 },
					{ m:26.6, u:27.8, l:25.4 }
				]
			}
		].forEach( (item) => runTest( item.p, item.v, item.e ) );
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
