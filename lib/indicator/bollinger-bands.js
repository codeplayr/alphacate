'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const MathUtil = require('./../utils/math');
const SMA = require('./simple-moving-average');

function BB( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: BB() must be called with new');

	this._options = {
		periods:20,
		startIndex: null,
		endIndex: null,
	}
	this.setOptions( options );
	this._collection = [];
}

BB.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		this._collection = values;
	},

	setOptions( options ){
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

	_validate(){
		if( _.isEmpty(this._collection) ){
			throw new Error('ERROR: No data');
		}

		if( this._options.periods > this._collection.length ){
			throw new Error('ERROR: periods option must be lower than values list length');
		}

		if( ! NumberUtil.isNumeric( this._options.periods ) || this._options.periods <= 1 ){
			throw new Error('ERROR: Invalid periods options');
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
			let sma = new SMA( {timePeriods: periods} );
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
