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
const ROC = require('./lib/indicator/rate-of-change')
const MFI = require('./lib/indicator/money-flow-index');

module.exports = {
	AverageTrueRange: ATR,
	ATR,
	BollingerBands: BB,
	BB,
	ExponentialMovingAverage: EMA,
	EMA,
	LinearlyWeightedMovingAverage: LWMA,
	LWMA,
	MovingAverageConvergenceDivergence: MACD,
	MACD,
	MoneyFlowIndex: MFI,
	MFI,
	OnBalanceVolume: OBV,
	OBV,
	RelativeStrengthIndex: RSI,
	RSI,
	SimpleMovingAverage: SMA,
	SMA,
	StochasticOscillator: SO,
	SO,
	RateOfChange: ROC,
	ROC,
}
