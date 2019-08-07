'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');

function SMA( options = {} ){
	if (! new.target ){
		throw new Error('ERROR: SMA() must be called with new');
	}
	this._options = {
		timePeriods: 10,
		startIndex: null,
		endIndex: null,
	};

	this.setOptions( options );
	this._collection = [];
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

	setOptions( options = {} ){
		if( ! _.isObject( options ) ){
			throw new Error('ERROR: Invalid Options argument');
		}

		if( _.isEmpty( options ) ){
			return;
		}

		this._options = _.extend( {}, this._options, options );
	},

	calculate(){
		this._validate();
		return this._compute();
	},

	_compute(){
		let results = [];

		let {timePeriods, startIndex, endIndex} = this._options;

		if( _.isNull( startIndex ) ) startIndex = 0;
		if( _.isNull( endIndex ) ) endIndex = this._collection.length - 1;
		if( startIndex >= endIndex ){
			throw new Error('ERROR: startIndex option must be lower than endIndex');
		}

		let cnt = (endIndex + 1) - (startIndex + 1) - timePeriods + 2;
		if( cnt <= 0 ){
			throw new Error('ERROR: Invalid range length');
		}

		let idx = startIndex;
		let endRangeIndex = endIndex - timePeriods + 1;

		while( idx <= endRangeIndex ){
			let avg = this._avg( idx, idx + timePeriods - 1 );
			results.push(  NumberUtil.roundTo( avg, 2 ) );
			idx++;
		}

		return results;
	},

	_validate(){
		if( _.isEmpty(this._collection) ){
			throw new Error('ERROR: No data');
		}

		if( ! NumberUtil.isNumeric( this._options.timePeriods ) || this._options.timePeriods <= 1 ){
			throw new Error('ERROR: Invalid timePeriods options');
		}

		if( ! _.isNull( this._options.startIndex ) && this._options.startIndex >= this._options.endIndex ){
			throw new Error('ERROR: startIndex must be lower than endIndex');
		}

		if( ! _.isNull( this._options.startIndex ) && this._options.startIndex > (this._collection.length - 1) ){
			throw new Error('ERROR: startIndex out of range');
		}

		if( ! _.isNull( this._options.endIndex ) && this._options.endIndex > (this._collection.length - 1) ){
			throw new Error('ERROR: endIndex out of range');
		}

		if( ! _.isNull( this._options.startIndex ) && ! NumberUtil.isNumeric( this._options.startIndex ) ){
			throw new Error('ERROR: invalid startIndex option type');
		}

		if( NumberUtil.isNumeric(this._options.startIndex ) && this._options.startIndex < 0 ){
			throw new Error('ERROR: starIndex option must be greater or equal 0');
		}

		if( ! _.isNull( this._options.endIndex ) && ! NumberUtil.isNumeric( this._options.endIndex ) ){
			throw new Error('ERROR: invalid endIndex option type');
		}

		if( NumberUtil.isNumeric(this._options.endIndex ) && this._options.endIndex < 0  ){
			throw new Error('ERROR: endIndex option must be greater or equal 0');
		}

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
