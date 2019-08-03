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
	};

	this._options = _.extend( {}, this._options, options || {});
	this._values = [];
}

MACD.prototype.add = function( val ){
	this._values.push( val );
}

MACD.prototype.setValues = function( values ){
	if( ! Array.isArray( values )){
		throw new Error('ERROR: values param is not an array');
	}
	this._values = this._values.concat( values );
}

MACD.prototype.clear = function(){
	this._values = [];
}

MACD.prototype.calculate = function(  ){
	this._validate();
	return this._compute();
}

MACD.prototype._validate = function(){
	let {slowPeriods, fastPeriods} = this._options;
	if( slowPeriods < fastPeriods ){
		throw new Error('ERROR: slowPeriods option must be higher than fastPeriods');
	}
}

MACD.prototype._compute = function(){
	let slow_ema = new EMA( {range: this._options.slowPeriods, emaResultsOnly: true } );
	let fast_ema = new EMA( {range: this._options.fastPeriods, emaResultsOnly: true } );

	slow_ema.setValues( this._values );
	fast_ema.setValues( this._values );

	let results_slow = slow_ema.calculate();
	let results_fast = fast_ema.calculate();

	let dif = this._options.slowPeriods - this._options.fastPeriods;

	results_fast = results_fast.slice( dif   );

	if( results_fast.length != results_slow.length ){
		throw new Error('ERROR: arrays have not same length');
	}

	let results_macd = [];

	for( var i=0; i<results_slow.length; i++ ){
		let dif = results_fast[ i ] - results_slow[ i ];
		results_macd.push( NumberUtil.roundTo( dif, 2) );
	}

	let signal_ema = new EMA({range: this._options.signalPeriods, emaResultsOnly: true});

	signal_ema.setValues( results_macd );

	let results_signal = signal_ema.calculate();

	return {
		slow_ema: results_slow,
		fast_ema: results_fast,
		signal_ema: results_signal,
		macd: results_macd,
	};
}

module.exports = MACD;
