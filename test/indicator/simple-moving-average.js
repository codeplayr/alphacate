'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const SMA = require('./../../lib/indicator/simple-moving-average');

describe('SMA', function(){

	let data = [1,2,3,4,5,6,7,8,9];

	it('should calculate correctly and return result', () => {
		function runTest( timePeriods, values, expectedResult ){
			let opts = { timePeriods };
			let sma = new SMA( opts );
			sma.setValues( values );
			let result = sma.calculate()

			assert.isArray( result )
			assert.isTrue( values.length - opts.timePeriods + 1  == result.length );
			assert.sameOrderedMembers( result, expectedResult );
		};

		[
			{t: 4, v:data, e: [2.5, 3.5, 4.5, 5.5, 6.5, 7.5] },
			{t: 9, v:data, e: [5]}
		].forEach( ( item ) => runTest( item.t, item.v, item.e ) );
	});

	it('should calculate correctly with starIndex and endIndex options and return result', () => {
		let opts = { timePeriods: 4, startIndex: 1, endIndex: data.length - 2 };
		let sma = new SMA( opts );
		sma.setValues( data );
		let result = sma.calculate();

		assert.isArray( result )
		assert.isTrue( (opts.endIndex + 1 - opts.startIndex + 1) - opts.timePeriods == result.length );
		assert.sameOrderedMembers( result, [3.5, 4.5, 5.5, 6.5] );
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
		
	it('should throw error on invalid timePeriods', () => {
		function runTest( timePeriods ){
			let sma = new SMA( { timePeriods } );
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
