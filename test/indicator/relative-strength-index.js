var assert = require('chai').assert;
var RSI = require('./../../lib/indicator/relative-strength-index');

describe('RSI', function(){

	var arr = [
		['09-12-14', 44.34],
		['09-12-15', 44.09],
		['09-12-16', 44.15],
		['09-12-17', 43.61],
		['09-12-18', 44.33],
		['09-12-21', 44.83],
		['09-12-22', 45.10],
		['09-12-23', 45.42],
		['09-12-24', 45.84],
		['09-12-28', 46.08],
		['09-12-29', 45.89],
		['09-12-30', 46.03],
		['09-12-31', 45.61],
		['10-01-04', 46.28],
		['10-01-05', 46.28],
		['10-01-06', 46.00],
		['10-01-07', 46.03],
		['10-01-08', 46.41],
		['10-01-11', 46.22],
		['10-01-12', 45.64],
		['10-01-13', 46.21],
		['10-01-14', 46.25],
		['10-01-15', 45.71],
	];

	it('should calculate', function(){

		var rsi = new RSI();

		arr.forEach( ( el ) => {
			rsi.add( el[0], el[1] );
		});

		var result = rsi.calculate( arr.length - 1, 14 );

		assert.isFalse( result.error );
		assert.isArray( result.collection );
		assert.isTrue( result.collection.length ==  arr.length );

		var item_14 = result.collection[ 13 ];

		assert.isNull( item_14.avg_gain );
		assert.isNull( item_14.avg_loss );
		assert.isNull( item_14.rs );
		assert.isNull( item_14.rsi );

		var last_item  = result.collection[result.collection.length - 1 ];
		assert.isString( last_item.date );
		assert.isTrue( last_item.price == 45.71 );
		assert.isTrue( last_item.gain == 0 );
		assert.closeTo( last_item.avg_gain, 0.2, 0.1 );
		assert.closeTo( last_item.loss, 0.5, 0.05 );
		assert.closeTo( last_item.rs, 1.3, 0.1 );
		assert.closeTo( last_item.rsi, 58, 1 );
	});

	it('should fail', function(){
		var rsi = new RSI();

		arr.forEach( ( el ) => {
			rsi.add( el[0], el[1] );
		});

		// timeperiod above array length
		var result = rsi.calculate( arr.length - 1, arr.length );
		assert.isTrue( result.error );

		// focusIndex above array length
		var result = rsi.calculate( arr.length, 14  );
		assert.isTrue( result.error );
	});


});
