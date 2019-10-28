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
	
});
