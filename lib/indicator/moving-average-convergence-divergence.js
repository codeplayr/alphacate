'use strict';

const _  = require('underscore');
const EMA = require('./exponential-moving-average');
const NumberUtil = require('./../utils/number');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function MACD( options = {} ){
	if( ! new.target ) throw new Error('ERROR: MACD() must be called with new');

	this._options = {
		fastPeriods: 12,
		slowPeriods: 26,
		signalPeriods: 9,
		sliceOffset: true,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};

	let m = [SetOptionsMixin, HandleGeneratorMixin];
	Object.assign( this, ...m );
	this.setOptions( options );
	this._collection = [];
}

MACD.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		this._collection = values;
	},

	clear(){
		this._collection = [];
	},

	calculate: function(){
		this._validate();
		return this._handleAsyncGenerator( this._compute() );
	},

	_validate(){
		let {slowPeriods, fastPeriods} = this._options;
		if( slowPeriods < fastPeriods ){
			throw new Error('ERROR: slowPeriods option must be higher than fastPeriods');
		}
	},

	_compute: async function * (){
		let self = this;

		let {slowPeriods, fastPeriods, signalPeriods, sliceOffset, lazyEvaluation} = this._options;

		let results_slow = [];
		let results_fast_orig = [];

		let slow_ema = new EMA( {periods: slowPeriods, lazyEvaluation } );
		let fast_ema = new EMA( {periods: fastPeriods, lazyEvaluation } );

		slow_ema.setValues( self._collection );
		fast_ema.setValues( self._collection );

		let res_1 = await slow_ema.calculate();
		let res_2 = await fast_ema.calculate();

		for( let i=0, len=Math.max( res_1.length, res_2.length ); i<len; i++ ){
			if( i < res_1.length ) results_slow.push( res_1[i].ema );
			if( i < res_2.length ) results_fast_orig.push( res_2[i].ema );
		}

		let dif = slowPeriods - fastPeriods;

		let results_fast = results_fast_orig.slice( dif );

		if( results_fast.length != results_slow.length ){
			throw new Error('ERROR: arrays have not same length');
		}

		let results_macd = [];

		for( let i=0, len=results_slow.length; i<len; i++ ){
			let dif = results_fast[ i ] - results_slow[ i ];
			results_macd.push( NumberUtil.roundTo( dif, 2) );
		}

		let signal_ema = new EMA({periods: signalPeriods, lazyEvaluation });

		signal_ema.setValues( results_macd );

		let res_3 = await signal_ema.calculate();

		let prices = this._collection;

		let results_signal = [];
		for(let i=0; i<res_3.length; i++){
			results_signal.push( res_3[ i ].ema );
		}

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
			prices = this._collection.slice( slowPeriods + signalPeriods - 2 );
		}

		yield {
			slow_ema: results_slow,
			fast_ema:  (!sliceOffset) ? results_fast_orig : results_fast,
			signal_ema: results_signal,
			macd: results_macd,
			prices,
		};

	}
}

module.exports = MACD;
