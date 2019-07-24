'use strict';

var assert = require('chai').assert;
var EMA = require('./../../lib/indicator/exponential-moving-average');

describe('EMA', function(){

	var arr = {
		items: [
			22.27,
			22.19,
			22.08,
			22.17,
			22.18,
			22.13,
			22.23,
			22.43,
			22.24,
			22.29,
			22.15,
			22.39,
			22.38,
			22.61,
			23.36,
			24.05,
			23.75,
			23.83,
			23.95,
			23.63,
			23.82,
			23.87,
			23.65,
			23.19,
			23.10,
			23.33,
			22.68,
			23.10,
			22.40,
			22.17,
	  	],
	  	range: 10,
		results: [
			22.22,
			22.21,
			22.24,
			22.27,
			22.33,
			22.52,
			22.80,
			22.97,
			23.13,
			23.28,
			23.34,
			23.43,
			23.51,
			23.53,
			23.47,
			23.40,
			23.39,
			23.26,
			23.23,
			23.08,
			22.92
		]
	};

	it('should calculate correctly and return results', function(){
		var ema = new EMA();
		arr.items.forEach( ( item ) => ema.add( item ));

		var results = ema.calculate( {range: arr.range} );

		assert.isArray( results );
		assert.isTrue( arr.items.length - (arr.range - 1) == results.length );
		results.forEach( (item, idx) => assert.closeTo( item.ema, arr.results[ idx ], 0.02 ));
	});


});
