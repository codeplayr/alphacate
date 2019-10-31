'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const SO = require('./../../lib/indicator/stochastic-oscillator');

describe('Stochastic Oscilator', () => {

	it('should find the lowest and highest price', () => {
		let data = [ 3,5,1,8,7,2,6,3,2 ];

		let runTest = ( type, startIndex, endIndex, expectedResult ) => {
			let so = new SO();
			so.setValues( data );

			let result = so._findPrice( type, startIndex, endIndex );
			assert.isNumber( result );
			assert.isTrue( result === expectedResult );
		};

		[
			['lowest', 0, data.length - 1, 1],
			['highest', 0, data.length - 1, 8],
			['lowest', 3, 5, 2],
			['highest', 3, 5, 8],
		].forEach( (item, idx) => {
			runTest( item[0], item[1], item[2], item[3] );
		});
	});

	it('should calculate correctly and return results', () => {
		let data = [ 3,5,1,8,7,2,6,3,2,3 ];

		let expectedResults_1 = [
			{ k: 85.7, d:0,	price: 7 },
			{ k: 14.3, d:0,	price: 2 },
			{ k: 71.4, d:0,	price: 6 },
			{ k: 16.7, d:0,	price: 3 },
			{ k: 0,	   d:34.1, price: 2 },
			{ k: 25.0, d:29.3, price: 3 },
		];

		let expectedResults_2 = [
			{ k: 25, d: 0, price: 3 }
		];		

		let expectedResults_3 = [
			{ k: 0, d:0, price: 3 },
			{ k: 0, d:0, price: 5 },
			{ k: 0, d:0, price: 1 },
			{ k: 0, d:0, price: 8 },
		].concat( expectedResults_1 );

		let runTest = async ( options, data, expectedResults) => {
			let so = new SO( options );
			so.setValues( data );
			let results = await so.calculate();

			assert.isArray( results );
			assert.isTrue( results.length == expectedResults.length );

			results.forEach( (item, idx) => {
				assert.isObject( item );
				assert.closeTo( item.k, expectedResults[idx].k, 0.1 );
				assert.closeTo( item.d, expectedResults[idx].d, 0.1 );
				assert.isTrue( item.price == expectedResults[idx].price );
			});
		}

		let tests = [
			{o: {periods: 4, sliceOffset: true, lazyEvaluation: true}, d: data, e: expectedResults_1 },
			{o: {periods:4, sliceOffset: true, startIndex: 5, lazyEvaluation: true } , d: data, e: expectedResults_2} ,
			{o: {periods: 4, sliceOffset: false, lazyEvaluation: true }, d: data, e: expectedResults_3 },			
		];

		for(let i=0; i<tests.length; i++){
			let item = tests[ i ];
			runTest( item.o, item.d, item.e );
		}

	});

	it('should throw error on invalid options', () => {
		let data = [ 3,5,1,8,7,2,6,3,2 ];

		function runTest( opts ){
			opts = Object.assign( {}, opts, {lazyEvaluation: false} );
			let so = new SO( opts);
			so.setValues( data );
			assert.throws( () => so.calculate(), Error );
		};

		[
			{ periods: data.length + 1 },
			{ startIndex: data.length + 1 },
			{ startIndex: 1, periods: data.length },
			{ endIndex: data.length + 1 },
			{ periods: 'foo' },
			{ startIndex: data.length, endIndex: 0 },
			{ startIndex: 1, periods: 10 },
			{ startIndex: 1, endIndex: 2 },
		].forEach( ( item ) => runTest( item )  );

	});
		
});
