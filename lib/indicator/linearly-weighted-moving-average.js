'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const MathUtil = require('./../utils/math');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function LWMA( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: LWMA() must be called with new');

	this._options = {
		periods:20,
		startIndex: null,
		endIndex: null,
		includeOffset: false,
	}
	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
}

LWMA.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}

		this._collection = values;
	},

	calculate(){
		this._validate( this._collection, this._options );
		return this._compute();
	},

	_compute(){
		let results = [];
		let {periods, startIndex, endIndex, includeOffset} = this._options;

		if( _.isNull( startIndex ) ) startIndex  = 0;
		if( _.isNull( endIndex ) ) endIndex = this._collection.length - 1;

		let endRangeIndex = endIndex - periods + 1;

		if( includeOffset ){
			for( let i=startIndex; i<startIndex+periods - 1; i++ ){
				results.push({
					lwma: 0,
					price: this._collection[i],
				});
			}
		}

		let itr_i = 0;
		for( let i=startIndex; i<= endRangeIndex; i++ ){
			let sum_vals = 0;
			let sum_weight = 0;
			itr_i++;
			let itr_j = 0;
			let lastIdxInPeriod = 0;
			for(let j=i, len=i + periods; j<len; j++){
				let n = itr_i + itr_j;
				sum_vals += ( this._collection[ j ] * n );
				sum_weight += n;
				itr_j++;
				lastIdxInPeriod = j;
			}

			results.push({
				lwma: NumberUtil.roundTo( sum_vals / sum_weight, 2 ),
				price: this._collection[ lastIdxInPeriod ],
			});
		};

		return results;
	},

};

module.exports = LWMA;
