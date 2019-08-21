'use strict';
const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function RSI( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: RSI() must be called with new');
	this._options ={
		startIndex: null,
		endIndex: null,
		periods: 14,
	};
	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
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
		this._validate( this._collection, this._options );
		return this._compute();
	},

	_compute(){
		let result = null;

		let {periods, startIndex, endIndex} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let {gain: avg_gain, loss: avg_loss} = this._collection[ startIndex + periods ];

		for(let i=startIndex; i< startIndex + periods; i++){
			avg_gain += this._collection[ i ].gain;
			avg_loss += this._collection[ i ].loss;
		}

		let ag = avg_gain  / periods;
		let al = avg_loss  / periods;
		let rs = ag  / al;
		let rsi =  100 - ( 100 / ( 1 + rs ) );

		this._collection[ startIndex + periods ].avg_gain = NumberUtil.roundTo( ag, 2 );
		this._collection[ startIndex + periods ].avg_loss = NumberUtil.roundTo( al, 2 );
		this._collection[ startIndex + periods ].rs = NumberUtil.roundTo( rs, 2 );
		this._collection[ startIndex + periods ].rsi = NumberUtil.roundTo( rsi, 2 );

		let prev_avg_gain = this._collection[ startIndex + periods ].avg_gain;
		let prev_avg_loss = this._collection[ startIndex + periods ].avg_loss;

		for(let i=startIndex + periods + 1; i<=endIndex; i++ ){
			let ag = ((prev_avg_gain * (periods - 1) ) + this._collection[ i ].gain  ) / periods;
			let al = ((prev_avg_loss * (periods - 1) ) + this._collection[ i ].loss ) / periods;
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
