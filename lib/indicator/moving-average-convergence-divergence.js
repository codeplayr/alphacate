'use strict';

const _  = require('underscore');
const EMA = require('./exponential-moving-average');
const NumberUtil = require('./../utils/number');

function MACD( options = {} ){
	if( ! new.target ) throw new Error('ERROR: MACD() must be called with new');

	this._options = {
		fastPeriods: 12,
		slowPeriods: 26,
		signalPeriods: 9,
		sliceOffset: true,
	};

	this._options = _.extend( {}, this._options, options || {});
	this._values = [];
}

MACD.prototype = {
	add( val ){
		this._values.push( val );
	},

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		this._values = this._values.concat( values );
	},

	clear(){
		this._values = [];
	},

	calculate(){
		this._validate();
		return this._compute();
	},

	_validate(){
		let {slowPeriods, fastPeriods} = this._options;
		if( slowPeriods < fastPeriods ){
			throw new Error('ERROR: slowPeriods option must be higher than fastPeriods');
		}
	},

	_compute(){

		let {slowPeriods, fastPeriods, signalPeriods, sliceOffset} = this._options;

		let slow_ema = new EMA( {periods: slowPeriods, emaResultsOnly: true } );
		let fast_ema = new EMA( {periods: fastPeriods, emaResultsOnly: true } );

		slow_ema.setValues( this._values );
		fast_ema.setValues( this._values );

		let results_slow = slow_ema.calculate();
		let results_fast_orig = fast_ema.calculate();

		let dif = slowPeriods - fastPeriods;

		let results_fast = results_fast_orig.slice( dif   );

		if( results_fast.length != results_slow.length ){
			throw new Error('ERROR: arrays have not same length');
		}

		let results_macd = [];

		for( let i=0, len=results_slow.length; i<len; i++ ){
			let dif = results_fast[ i ] - results_slow[ i ];
			results_macd.push( NumberUtil.roundTo( dif, 2) );
		}

		let signal_ema = new EMA({periods: signalPeriods, emaResultsOnly: true});

		signal_ema.setValues( results_macd );

		let results_signal = signal_ema.calculate();
		let prices = this._values;

		if( ! sliceOffset ){
			for(let i=0; i<slowPeriods + signalPeriods - 2; i++){
				if( i<fastPeriods - 1 )	results_fast_orig.unshift(0);
				if( i < slowPeriods - 1 ){
					results_slow.unshift(0);
					results_macd.unshift(0);
				}
				results_signal.unshift(0);
			}
		}
		else{
			results_slow = results_slow.slice( signalPeriods - 1 );
			results_fast = results_fast.slice( signalPeriods - 1 );
			results_macd = results_macd.slice( signalPeriods - 1 );
			prices = this._values.slice( slowPeriods + signalPeriods - 2 );
		}

		return {
			slow_ema: results_slow,
			fast_ema:  (!sliceOffset) ? results_fast_orig : results_fast,
			signal_ema: results_signal,
			macd: results_macd,
			prices,
		};
	}
}

module.exports = MACD;
