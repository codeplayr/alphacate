'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const SMA = require('./../../lib/indicator/simple-moving-average');

describe('SMA', function(){

	let data = [1,2,3,4,5,6,7,8,9];

	it('should calculate correctly and return result', () => {
		function runTest( options, values, expectedResult, expectedPrice ){
			let sma = new SMA( options );
			sma.setValues( values );
			let results = sma.calculate();

			assert.isArray( results )

			results.forEach( (item, idx) => {
				assert.isObject( item );
				assert.containsAllKeys( item, ['price', 'sma'] );
				assert.isNumber( item.price );
				assert.isNumber( item.sma );
				assert.closeTo( expectedResult[idx], item.sma, 0.1 );  
				assert.isTrue( item.price == expectedPrice[ idx ] );
			});
		};

		[
			{o: {periods: 4}, v:data, e: [2.5, 3.5, 4.5, 5.5, 6.5, 7.5], ep: [4,5,6,7,8,9] },
			{o: {periods: 9}, v:data, e: [5], ep: [9] },
			{o: {periods: 4, sliceOffset: false}, v:data, e: [0, 0, 0, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5], ep:[1,2,3,4,5,6,7,8,9] },
		].forEach( ( item ) => runTest( item.o, item.v, item.e, item.ep ) );
	});

	it('should calculate correctly with starIndex and endIndex options and return result', () => {
		let opts = { periods: 4, startIndex: 1, endIndex: data.length - 2 };
		let sma = new SMA( opts );
		sma.setValues( data );
		let results = sma.calculate();

		assert.isArray( results )
		assert.isTrue( (opts.endIndex + 1 - opts.startIndex + 1) - opts.periods == results.length );

		let expectedResult =  [3.5, 4.5, 5.5, 6.5];

		results.forEach( (item, idx) => {
			assert.isObject( item );
			assert.containsAllKeys( item, ['price', 'sma'] );
			assert.isNumber( item.price );
			assert.isNumber( item.sma );
			assert.closeTo( expectedResult[idx], item.sma, 0.1 ); 
			assert.isTrue( item.price == data[ opts.startIndex + opts.periods -1 + idx ] ); 
		});
		
	});

	it('should throw error on invalid values', () => {
		assert.throws( () => SMA(), Error );
		assert.throws( () => (new SMA()).calculate(), Error );
		assert.throws( () => (new SMA()).setValues(1), Error );
		assert.throws( () => (new SMA()).setValues('foo'), Error );

		let sma = new SMA();
		sma.setValues(data);
		sma.clear();
		assert.throws( () => sma.calculate(), Error );
	});	
		
	it('should throw error on invalid periods', () => {
		function runTest( periods ){
			let sma = new SMA( { periods } );
			sma.setValues( data );
			assert.throws( () => sma.calculate(), Error );
		}

		let tp = [ data.length + 100, -100, 0, 1 ];
		tp.forEach( ( val ) => runTest( val ) );
	});

	it('should throw error on invalid startIndex and endIndex ', () => {
		function runTest( startIndex, endIndex ){
			let sma = new SMA( {startIndex, endIndex} );
			sma.setValues(data);
			assert.throws( () => sma.calculate(), Error );
		};

		[	[10,5],
			[5,5],
			[data.length, data.length + 1],
			[-10, 2],
			[0, -2],
		].forEach( item => runTest( item[0], item[1] ) );

		let sma = new SMA( {endIndex: data.length + 1} );
		sma.setValues(data);
		assert.throws( () => sma.calculate(), Error );
	});

});
