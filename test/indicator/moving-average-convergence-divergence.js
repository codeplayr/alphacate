'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const MACD = require('./../../lib/indicator/moving-average-convergence-divergence');

describe('MACD', () => {

	let data = [
		39.92,
		40.32,
		40.12,
		37.72,
		36.01,
		34.66,
		35.40,
		36.78,
		35.43,
		38.68,
		39.76,
		40.45,
		41.30,
		42.35,
		43.21,
		42.34,
		42.47,
		41.97,
		41.61,
		42.27,
		43.07,
		43.58,
		44.16,
		45.15,
		45.76,
		45.15,
		45.23,
		44.99,
		44.35,
		44.64,
		45.16,
		44.74,
		46.06,
		45.06,
		45.33,
		43.58,
		44.30,
		43.62,
		41.74,
		43.60,
		44.90,
		44.86,
		44.65,
		49.54,
		51.93,
		52.52,
		52.76,
		51.83,
		52.34,
		52.07,
		50.70,
		49.70,
		50.24,
		49.94,
		48.07,
		47.11,
		47.10,
		47.49,
		50.62,
		51.34,
		51.37,
		52.26,
		53.39,
		53.04,
		52.67,
	];

	let results_slow = {
		periods: 26,
		items: [
			40.45,
			40.49,
			40.51,
			40.54,
			40.76,
		]
	};

	let results_fast = {
		periods: 12,
		items: [
			38.90,
			38.71,
			38.42,
			38.11,
			38.18,
		]
	};

	let results_macd = {
		items: [
			-1.55,
			-1.78,
			-2.09,
			-2.43,
			-2.58,
		]
	};

	let results_signal = {
		items: [
			-1.96,
			-2.07,
			-2.14,
			-2.15,
			-2.08,
		]
	};

	let runTest = async ( opts, values, expectedLength ) => {
		let macd = new MACD( opts );
		macd.setValues( values);
		let result = await macd.calculate();
		
		assert.isArray(  result);
		assert.isTrue(result.length == 1 );

		result = result[0];
		assert.isObject( result );

		assert.isArray( result.slow_ema );
		assert.isArray( result.fast_ema );
		assert.isArray( result.signal_ema );
		assert.isArray( result.macd );
		assert.isArray( result.prices );

		assert.isTrue( result.slow_ema.length == expectedLength );
		assert.isTrue( result.fast_ema.length == expectedLength );
		assert.isTrue( result.signal_ema.length == expectedLength );
		assert.isTrue( result.macd.length == expectedLength );
		assert.isTrue( result.prices.length == expectedLength );

		results_slow.items.forEach( (result_val, idx) => {
			let val = result.slow_ema[ result.slow_ema.length - 1 - idx ];
			assert.closeTo(val, result_val,  0.05 );
		});

		results_fast.items.forEach( (result_val, idx) => {
			let val = result.fast_ema[ result.fast_ema.length - 1 - idx ];
			assert.closeTo(val, result_val,  0.05 );
		});

		results_macd.items.forEach( (result_val, idx) => {
			let val = result.macd[ result.macd.length - 1 - idx ];
			assert.closeTo(val, result_val, 0.05 );
		});

		results_signal.items.forEach( (result_val, idx) => {
			let val = result.signal_ema[ result.signal_ema.length - 1 - idx ];
			assert.closeTo(val, result_val, 0.05 );
		});
	}

	it('should calculate and return results', () => {
		(async () => {
			let opts = {fastPeriods: results_fast.periods, slowPeriods: results_slow.periods, signalPeriods: 9, lazyEvaluation: true, sliceOffset: true};
			let expectedLength = data.length - results_slow.periods - opts.signalPeriods + 2;
			let dataCopy = [...data];
			await runTest( opts, dataCopy.reverse(), expectedLength );
		})();
	});

	it('should calculate and return results with offset', () => {
		(async () => {
			let opts = {fastPeriods: results_fast.periods, slowPeriods: results_slow.periods, signalPeriods: 9, sliceOffset: false, lazyEvaluation: true};
			let expectedLength = data.length;
			let dataCopy = [...data];
			await runTest( opts, dataCopy.reverse(), expectedLength );
		})();
	});


});
