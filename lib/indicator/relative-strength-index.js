'use strict';
const _ = require('underscore');
const NumberUtil = require('./../utils/number');

function RSI( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: RSI() must be called with new');
	this._options ={
		focusIndex: null,
		timePeriods: 14,
	}
	this.setOptions( options );
	this._collection = [];
};

RSI.prototype = {
	add( price ){
		let gain = 0;
		let loss = 0;

		if( this._collection.length ){
			let diff = NumberUtil.roundTo( (price - this._collection[ this._collection.length - 1 ].price), 2);

			if( diff > 0 ) gain = diff;
			else loss =  Math.abs(diff);
		}

		this._collection.push({
			price: price,
			gain: gain,
			loss: loss,
			avg_gain: null,
			avg_loss: null,
			rs: null,
			rsi: null,
		});
	},

	setOptions( options = {}){
		if( ! _.isObject( options ) ){
			throw new Error('ERROR: Invalid Options argument');
		}
		if( _.isEmpty( options ) ){
			return;
		}
		this._options = _.extend( {}, this._options, options );
	},

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		values.forEach( (val) => this.add( val ) );
	},

	clear(){
		this._collection = [];
	},

	calculate(){
		this._validate();
		return this._compute();
	},

	_validate(){
		if( _.isNull(this._options.focusIndex) ){
			this._options.focusIndex = this._collection.length - 1;
		}

		if( this._collection.length <= this._options.timePeriods ){
			throw new Error('ERROR: Invalid timePeriods option');
		}

		if( this._collection.length - 1 < this._options.focusIndex ){
			throw new Error('ERROR: Invalid focusIndex option ');
		}

		if( this._options.focusIndex < this._options.timePeriods ){
			throw new Error('ERROR: focusIndex option should be greater than timePeriods');
		}
	},

	_compute(){
		let result = null;

		let {timePeriods, focusIndex} = this._options;
		let {gain: avg_gain, loss: avg_loss} = this._collection[ timePeriods ];

		for(let i=0; i<timePeriods; i++){
			avg_gain += this._collection[ i ].gain;
			avg_loss += this._collection[ i ].loss;
		}

		let ag = avg_gain  / timePeriods;
		let al = avg_loss  / timePeriods;
		let rs = ag  / al;
		let rsi =  100 - ( 100 / ( 1 + rs ) );

		this._collection[ timePeriods ].avg_gain = NumberUtil.roundTo( ag, 2 );
		this._collection[ timePeriods ].avg_loss = NumberUtil.roundTo( al, 2 );
		this._collection[ timePeriods ].rs = NumberUtil.roundTo( rs, 2 );
		this._collection[ timePeriods ].rsi = NumberUtil.roundTo( rsi, 2 );

		let prev_avg_gain = this._collection[ timePeriods ].avg_gain;
		let prev_avg_loss = this._collection[ timePeriods ].avg_loss;

		for(let i=timePeriods + 1; i<=focusIndex; i++ ){
			let ag = ((prev_avg_gain * (timePeriods - 1) ) + this._collection[ i ].gain  ) / timePeriods;
			let al = ((prev_avg_loss * (timePeriods - 1) ) + this._collection[ i ].loss ) / timePeriods;
			let rs = ag / al;
			let rsi = 100 - ( 100 / ( 1 + rs ) );

			this._collection[ i ].avg_gain = NumberUtil.roundTo( ag, 2 );
			this._collection[ i ].avg_loss = NumberUtil.roundTo( al, 2 );
			this._collection[ i ].rs = NumberUtil.roundTo( rs, 2 );
			this._collection[ i ].rsi = NumberUtil.roundTo( rsi, 2 );

			prev_avg_gain = this._collection[ i ].avg_gain;
			prev_avg_loss = this._collection[ i ].avg_loss;
		}

		result = this._collection.slice(0);

		return result;
	}
}

module.exports = RSI;
