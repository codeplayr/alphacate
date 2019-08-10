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

});