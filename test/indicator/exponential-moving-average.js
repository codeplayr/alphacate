'use strict';

const assert = require('chai').assert;
const EMA = require('./../../lib/indicator/exponential-moving-average');

describe('Exponential Moving Average', () => {

	let data = {
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
	  	periods: 10,
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

	let data_2 = {
		items: [
			22.81,
			23.09,
			22.91,
			23.23,
			22.83,
			23.05,
			23.02,
			23.29,
			23.41,
			23.49,
			24.60,
			24.63,
			24.51,
			23.73,
		],
		periods: 9,
		results: [
			22.81,
			22.87,
			22.87,
			22.95,
			22.92,
			22.95,
			22.96,
			23.03,
			23.10,
			23.18,
			23.47,
			23.70,
			23.86,
			23.83,
		]
	};

	let data_3 = {
		items: [
			22.81,
			23.09,
			22.91,
			23.23,
			22.83,
			23.05,
			23.02,
			23.29,
			23.41,
			23.49,
			24.60,
			24.63,
			24.51,
			23.73,
			23.31,
			23.53,
			23.06,
			23.25,
			23.12,
			22.80,
			22.84,
		],
		periods: 9,
		results: [
			23.07,
			23.18,
			23.47,
			23.70,
			23.86,
			23.83,
			23.73,
			23.69,
			23.56,
			23.50,
			23.42,
			23.30,
			23.21,
		]
	};

	it('should calculate correctly and return results', ( done ) => {
		(async () => {
			let ema = new EMA( {periods: data.periods, lazyEvaluation: true, sliceOffset: true } );
			ema.setValues( data.items );
			let results = await ema.calculate();
			assert.isArray( results );
			assert.isTrue( data.items.length - (data.periods - 1) == results.length );
			results.forEach( (item, idx) => assert.closeTo( item.ema, data.results[ idx ], 0.02 ));
			done();
		})();
	});

	it('should calculate correctly when started with first item and return results', (done) => {
		(async () => {
			let ema = new EMA( {periods: data_2.periods, startWithFirst: true, lazyEvaluation: true, sliceOffset: true } );
			ema.setValues( data_2.items );
			let results = await ema.calculate();
			assert.isArray( results );
			assert.isTrue( data_2.items.length == data_2.results.length );
			results.forEach( (item, idx) => {
				assert.closeTo( item.ema, data_2.results[ idx ], 0.02 );
			});
			done();
		})();
	});

	it('should calculate correctly with range and return results', (done) => {
		(async () => {
			let ema = new EMA( {periods: data_3.periods, sliceOffset: true } );
			ema.setValues( data_3.items );
			let results = await ema.calculate();
			assert.isArray( results );
			assert.isTrue( data_3.items.length - (data_3.periods - 1) == data_3.results.length );
			results.forEach( (item, idx) => {
				assert.closeTo( item.ema, data_3.results[ idx ], 0.05 );
			});
			done();
		})();
	});

	it('should calculate correctly with periods and return results with offset', (done) => {
		(async () => {
			let dataCopy = Object.assign({}, data );
			let i = 0;
			while( i < dataCopy.periods - 1 ){
				dataCopy.results.unshift( 0 );
				i++;
			}
			let ema = new EMA( {periods: dataCopy.periods, sliceOffset: false, lazyEvaluation: true} );
			ema.setValues( dataCopy.items );
			let results = await ema.calculate();
			assert.isArray( results );
			assert.isTrue( dataCopy.items.length == results.length );
			results.forEach( (item, idx) => assert.closeTo( item.ema, dataCopy.results[ idx ], 0.02 ));
			done();
		})();
	});

});
