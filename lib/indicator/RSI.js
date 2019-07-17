'use strict';

var RSI = function(){
	if (! new.target ) throw new Error( 'ERROR: RSI() must be called with new');
	this._collection = [];
};

RSI.prototype.add = function( date, price ){
	var gain = 0;
	var loss = 0;

	if( this._collection.length ){
		var diff = parseFloat( (price - this._collection[ this._collection.length - 1 ].price).toFixed(2) );

		if( diff > 0 ) gain = diff;
		else loss =  Math.abs(diff);
	}

	this._collection.push({
		date: date,
		price: price,
		gain: gain,
		loss: loss,
		avg_gain: null,
		avg_loss: null,
		rs: null,
		rsi: null,
	});
};

RSI.prototype.reset = function(){
	this._collection = [];
};

RSI.prototype.calculate = function( focusIndex, timePeriods ){
	var result = {error: true, collection: []};

	if( ! Array.isArray( this._collection ) ||  this._collection.length <= timePeriods || this._collection.length - 1 < focusIndex || focusIndex < timePeriods ){
		return result;
	}

	var avg_gain = this._collection[ timePeriods ].gain;
	var avg_loss = this._collection[ timePeriods ].loss;

	for(var i=0; i<timePeriods; i++){
		avg_gain += this._collection[ i ].gain;
		avg_loss += this._collection[ i ].loss;
	}

	var ag = avg_gain  / timePeriods;
	var al = avg_loss  / timePeriods;
	var rs = ag  / al;
	var rsi =  100 - ( 100 / ( 1 + rs ) );

	this._collection[ timePeriods ].avg_gain = parseFloat( ag.toFixed(2) );
	this._collection[ timePeriods ].avg_loss = parseFloat( al.toFixed(2) );
	this._collection[ timePeriods ].rs = parseFloat( rs.toFixed(2) );
	this._collection[ timePeriods ].rsi = parseFloat( rsi.toFixed(2));

	var prev_avg_gain = this._collection[ timePeriods ].avg_gain;
	var prev_avg_loss = this._collection[ timePeriods ].avg_loss;

	for(var i=timePeriods + 1; i<=focusIndex; i++ ){
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
};

module.exports = RSI;
