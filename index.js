'use strict';

const atr = require('./lib/indicator/average-true-range');
const bb = require('./lib/indicator/bollinger-bands');
const ema = require('./lib/indicator/exponential-moving-average');
const lwma = require('./lib/indicator/linearly-weighted-moving-average');
const macd = require('./lib/indicator/moving-average-convergence-divergence');
const obv = require('./lib/indicator/on-balance-volume');
const rsi = require('./lib/indicator/relative-strength-index');
const sma = require('./lib/indicator/simple-moving-average');
const so = require('./lib/indicator/stochastic-oscillator');

module.exports = {
	averageTrueRange: atr,
	atr,
	bollingerBands: bb,
	bb,
	exponentialMovingAverage: ema,
	ema,
	linearlyWeightedMovingAverage: lwma,
	lwma,
	movingAverageConvergenceDivergence: macd,
	macd,
	onBalanceVolume: obv,
	obv,
	relativeStrengthIndex: rsi,
	rsi,
	simpleMovingAverage: sma,
	sma,
	stochasticOscillator: so,
	so,
}
