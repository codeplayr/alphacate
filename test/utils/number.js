'use strict';
var assert = require('chai').assert;

var NumberUtil = require('./../../lib/utils/number');

describe('Number', function(){

	it('should detected nunmeric value', () => {
		assert.isTrue( NumberUtil.isNumeric(-1) );
		assert.isTrue( NumberUtil.isNumeric(-1.12345) );
		assert.isTrue( NumberUtil.isNumeric(0) );
		assert.isTrue( NumberUtil.isNumeric(1) );
		assert.isTrue( NumberUtil.isNumeric(1.0236) );
		assert.isTrue( NumberUtil.isNumeric('0') );
		assert.isTrue( NumberUtil.isNumeric('1') );
		assert.isTrue( NumberUtil.isNumeric('1.123') );
		assert.isFalse( NumberUtil.isNumeric('lol') );
		assert.isFalse( NumberUtil.isNumeric('10a') );
		assert.isFalse( NumberUtil.isNumeric( null ) );
	});

	it('should round floats to 2 places', function() {

		var cases = [
			{ n: 10,      e: 10,    p:2 },
			{ n: 1.7777,  e: 1.78,  p:2 },
			{ n: 1.005,   e: 1.01,  p:2 },
			{ n: 1.005,   e: 1,     p:0 },
			{ n: 1.77777, e: 1.8,   p:1 }
		]

		cases.forEach(function(testCase) {
			//use default rounding
			var r = NumberUtil.roundTo( testCase.n, testCase.p, 'default' );
			assert.equal(r, testCase.e, 'didn\'t get right number');
		});

	});

});
