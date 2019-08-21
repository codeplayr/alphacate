'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function SMA( options = {} ){
	if (! new.target ){
		throw new Error('ERROR: SMA() must be called with new');
	}
	this._options = {
		periods: 10,
		startIndex: null,
		endIndex: null,
	};

	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
}

SMA.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		this._collection = values;
	},

	clear(){
		this._collection = [];
	},

	calculate(){
		this._validate( this._collection, this._options );
		return this._compute();
	},

	_compute(){
		let results = [];

		let {periods, startIndex, endIndex} = this._options;

		if( _.isNull( startIndex ) ) startIndex = 0;
		if( _.isNull( endIndex ) ) endIndex = this._collection.length - 1;
		if( startIndex >= endIndex ){
			throw new Error('ERROR: startIndex option must be lower than endIndex');
		}

		let cnt = (endIndex + 1) - (startIndex + 1) - periods + 2;
		if( cnt <= 0 ){
			throw new Error('ERROR: Invalid range length');
		}

		let idx = startIndex;
		let endRangeIndex = endIndex - periods + 1;

		while( idx <= endRangeIndex ){
			let endPeriodIndex =  idx + periods - 1;
			let avg = this._avg( idx, endPeriodIndex );
			let resultItem = {
				price: this._collection[ endPeriodIndex ],
				sma: NumberUtil.roundTo( avg, 2 ),
			};
			results.push( resultItem );
			idx++;
		}

		return results;
	},

	_avg(startIndex, endIndex){
		let sum = 0;

		let cnt = 0;
		for(let i=startIndex; i <= endIndex;i++){
			sum += this._collection[ i ];
			cnt++;
		}

		return (parseFloat(sum) / cnt );
	}
}

module.exports = SMA;
