'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const MathUtil = require('./../utils/math');
const SMA = require('./simple-moving-average');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function BB( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: BB() must be called with new');

	this._options = {
		periods:20,
		startIndex: null,
		endIndex: null,
	}
	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
}

BB.prototype = {

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
		let {periods, startIndex, endIndex} = this._options;

		if( _.isNull(startIndex) ) startIndex = 0;
		if( _.isNull(endIndex) ) endIndex = this._collection.length - 1 - periods;

		let result = {
			upper: [],
			middle: [],
			lower: [],
			price: [],
		}

		let idx = startIndex;
		let endRangeIndex = this._collection.length - periods;

		while( idx <= endRangeIndex ){
			let sma = new SMA( {periods} );
			let items = this._collection.slice( idx, idx + periods  );
			sma.setValues( items );
			let results = sma.calculate();

			result.price.push( this._collection[ idx + periods - 1 ] );

			let stdDev = NumberUtil.roundTo( MathUtil.standardDeviation( items, "population" ), 2);

			results.forEach( (val) => {
				result.middle.push( val );
				result.upper.push( NumberUtil.roundTo( val + (2 * stdDev), 2 ) );
				result.lower.push( NumberUtil.roundTo( val - (2 * stdDev), 2 ) );
			});

			idx++;
		}

		return result;
	}
}

module.exports = BB;
