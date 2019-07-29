'use strict';
const _ = require('underscore');

function RSI( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: RSI() must be called with new');
	this._options ={
		focusIndex: null,
		timePeriods: 14,
	}
	this.setOptions( options );
	this._collection = [];
};

RSI.prototype.add = function( price ){
	let gain = 0;
	let loss = 0;

	if( this._collection.length ){
		let diff = parseFloat( (price - this._collection[ this._collection.length - 1 ].price).toFixed(2) );

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
};

RSI.prototype.setOptions = function( options = {}){
	if( ! _.isObject( options ) ){
		throw new Error('ERROR: Invalid Options argument');
	}
	if( _.isEmpty( options ) ){
		return;
	}
	this._options = _.extend( {}, this._options, options );
}

RSI.prototype.setValues = function( values ){
	if( ! Array.isArray( values )){
		throw new Error('ERROR: values param is not an array');
	}
	values.forEach( (val) => this.add( val ) );
}

RSI.prototype.clear = function(){
	this._collection = [];
};

RSI.prototype.calculate = function(){
	this._validate();
	return this._compute();
};

RSI.prototype._validate = function(){
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

	return true;
}

RSI.prototype._compute = function(){
	let result = {error: true, collection: []};
	let timePeriods = this._options.timePeriods;
	let focusIndex = this._options.focusIndex;
	let avg_gain = this._collection[ timePeriods ].gain;
	let avg_loss = this._collection[ timePeriods ].loss;

	for(let i=0; i<timePeriods; i++){
		avg_gain += this._collection[ i ].gain;
		avg_loss += this._collection[ i ].loss;
	}

	let ag = avg_gain  / timePeriods;
	let al = avg_loss  / timePeriods;
	let rs = ag  / al;
	let rsi =  100 - ( 100 / ( 1 + rs ) );

	this._collection[ timePeriods ].avg_gain = parseFloat( ag.toFixed(2) );
	this._collection[ timePeriods ].avg_loss = parseFloat( al.toFixed(2) );
	this._collection[ timePeriods ].rs = parseFloat( rs.toFixed(2) );
	this._collection[ timePeriods ].rsi = parseFloat( rsi.toFixed(2));

	let prev_avg_gain = this._collection[ timePeriods ].avg_gain;
	let prev_avg_loss = this._collection[ timePeriods ].avg_loss;

	for(let i=timePeriods + 1; i<=focusIndex; i++ ){
		let ag = ((prev_avg_gain * (timePeriods - 1) ) + this._collection[ i ].gain  ) / timePeriods;
		let al = ((prev_avg_loss * (timePeriods - 1) ) + this._collection[ i ].loss ) / timePeriods;
		let rs = ag / al;
		let rsi = 100 - ( 100 / ( 1 + rs ) );

		this._collection[ i ].avg_gain = parseFloat( ag.toFixed(2) );
		this._collection[ i ].avg_loss = parseFloat( al.toFixed(2) );
		this._collection[ i ].rs = parseFloat( rs.toFixed(2) );
		this._collection[ i ].rsi = parseFloat( rsi.toFixed(2) );

		prev_avg_gain = this._collection[ i ].avg_gain;
		prev_avg_loss = this._collection[ i ].avg_loss;
	}

	result.error = false;
	result.collection = this._collection.slice(0);

	return result;
}

module.exports = RSI;
