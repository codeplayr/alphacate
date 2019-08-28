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
			let result = bb.calculate();

			assert.isArray( result.middle )
			assert.isTrue( values.length - opts.periods + 1  == result.middle.length );

			expectedResult.forEach( ( expected, idx ) => {
				assert.closeTo( result.upper[idx], expected.u, 0.1 );
				assert.closeTo( result.middle[idx], expected.m, 0.1 );
				assert.closeTo( result.lower[idx], expected.l, 0.1 );
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

	it('should throw error on invalid options', () => {
		function runTest( opts ){
			let bb = new BB( opts );
			bb.setValues( items );
			assert.throws( () => bb.calculate(), Error );
		};

		[
			{ periods: items.length + 1 },
			{ startIndex: items.length + 1 },
			{ startIndex: 1, periods: items.length },
			{ endIndex: items.length + 1 },
			{ periods: 'foo' },
			{ startIndex: items.length, endIndex: 0 },
		].forEach( ( item ) => runTest( item )  );

	});	

});
