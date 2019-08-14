'use strict';

const assert = require('chai').assert;
const RSI = require('./../../lib/indicator/relative-strength-index');

describe('RSI', function(){

	let data = [
		44.34,
		44.09,
		44.15,
		43.61,
		44.33,
		44.83,
		45.10,
		45.42,
		45.84,
		46.08,
		45.89,
		46.03,
		45.61,
		46.28,
		46.28,
		46.00,
		46.03,
		46.41,
		46.22,
		45.64,
		46.21,
		46.25,
		45.71,
	];

	it('should calculate correctly and return results', () => {
		let rsi = new RSI();
		rsi.setValues( data );

		let result = rsi.calculate();

		assert.isFalse( result.error );
		assert.isArray( result.collection );
		assert.isTrue( result.collection.length ==  data.length );

		let item_14 = result.collection[ 13 ];

		assert.isNull( item_14.avg_gain );
		assert.isNull( item_14.avg_loss );
		assert.isNull( item_14.rs );
		assert.isNull( item_14.rsi );

		let last_item  = result.collection[result.collection.length - 1 ];

		assert.isTrue( last_item.price == 45.71 );
		assert.isTrue( last_item.gain == 0 );
		assert.closeTo( last_item.avg_gain, 0.2, 0.1 );
		assert.closeTo( last_item.loss, 0.5, 0.05 );
		assert.closeTo( last_item.rs, 1.3, 0.1 );
		assert.closeTo( last_item.rsi, 58, 1 );
	});

	it('should throw error on invalid options', () => {
		// timeperiod above array length
		let rsi = new RSI( {focusIndex: data.length - 1, timePeriods: data.length } );
		rsi.setValues( data );
		assert.throw( () => rsi.calculate(), Error );

		// focusIndex above array length
		rsi = new RSI( {focusIndex: data.length, timePeriods: 14 } );
		rsi.setValues( data );
		assert.throw( () => rsi.calculate(), Error );

	});


});
