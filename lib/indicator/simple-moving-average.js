'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function SMA( options = {} ){
	if (! new.target ){
		throw new Error('ERROR: SMA() must be called with new');
	}

	this._options = {
		periods: 10,
		startIndex: null,
		endIndex: null,
		sliceOffset: false,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};

	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
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

	calculate(){
		this._validate( this._collection, this._options );
		return this._handleGenerator( this._compute() );
	},

	_compute: function * () {
		let results = [];

		let {periods, startIndex, endIndex, sliceOffset, lazyEvaluation} = this._options;

		let convertToResultItem = ( price, sma ) =>{
			return {price, sma: NumberUtil.roundTo( sma, 2 ) };
		}

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

		if( ! sliceOffset ){
			for(let i=startIndex; i<startIndex + periods - 1; i++ ){
				let resultItem = convertToResultItem( this._collection[ i ], 0 );
				results.push( resultItem );
				if( lazyEvaluation ) yield resultItem;
			}
		}

		while( idx <= endRangeIndex ){
			let endPeriodIndex =  idx + periods - 1;
			let avg = this._avg( idx, endPeriodIndex );
			let resultItem = convertToResultItem( this._collection[ endPeriodIndex ], avg );
			results.push( resultItem );
			if(  lazyEvaluation ) yield resultItem;
			idx++;
		}

		if( ! lazyEvaluation ) yield results;
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
