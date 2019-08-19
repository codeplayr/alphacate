'use strict';

const ATR = require('./lib/indicator/average-true-range');
const BB = require('./lib/indicator/bollinger-bands');
const EMA = require('./lib/indicator/exponential-moving-average');
const LWMA = require('./lib/indicator/linearly-weighted-moving-average');
const MACD = require('./lib/indicator/moving-average-convergence-divergence');
const OBV = require('./lib/indicator/on-balance-volume');
const RSI = require('./lib/indicator/relative-strength-index');
const SMA = require('./lib/indicator/simple-moving-average');
const SO = require('./lib/indicator/stochastic-oscillator');

module.exports = {
	averageTrueRange: ATR,
	ATR,
	bollingerBands: BB,
	BB,
	exponentialMovingAverage: EMA,
	EMA,
	linearlyWeightedMovingAverage: LWMA,
	LWMA,
	movingAverageConvergenceDivergence: MACD,
	MACD,
	onBalanceVolume: OBV,
	OBV,
	relativeStrengthIndex: RSI,
	RSI,
	simpleMovingAverage: SMA,
	SMA,
	stochasticOscillator: SO,
	SO,
}
