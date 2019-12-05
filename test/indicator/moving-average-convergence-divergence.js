'use strict';

const assert = require('chai').assert;
const MACD = require('./../../lib/indicator/moving-average-convergence-divergence');
const Fixture = require('./../fixtures/moving-average-convergence-divergence');

describe('Moving Average Convergence Divergence', () => {

	let data = Fixture.data;

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
