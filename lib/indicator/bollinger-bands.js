'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const MathUtil = require('./../utils/math');
const SMA = require('./simple-moving-average');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function BB( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: BB() must be called with new');

	this._options = {
		periods:20,
		startIndex: null,
		endIndex: null,
		sliceOffset: false,
		lazyEvaluation: true,
		maxTickDuration: 10,
	}

	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
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

	calculate(){
		this._validate( this._collection, this._options );
		return  this._handleGenerator( this._compute() );
	},

	_compute: function * (){
		let results = [];

		let {periods, startIndex, endIndex, sliceOffset, lazyEvaluation} = this._options;

		if( _.isNull(startIndex) ) startIndex = 0;
		if( _.isNull(endIndex) ) endIndex = this._collection.length - 1 - periods;

		let idx = startIndex;
		let endRangeIndex = this._collection.length - periods;

		if( ! sliceOffset ){
			let i = idx;
			while( i < startIndex + periods - 1 ){
				let resultItem = {
					upper: 0, middle: 0, lower: 0, price: this._collection[ i ],
				};
				results.push( resultItem );
				if( lazyEvaluation ) yield resultItem;
				i++;
			}
		}

		while( idx <= endRangeIndex ){
			let sma = new SMA( {periods, lazyEvaluation: false} );
			let items = this._collection.slice( idx, idx + periods  );
			sma.setValues( items );
			let r = sma.calculate();
			let resultItem = { upper: 0, middle: 0, lower: 0, price: this._collection[ idx + periods - 1 ] };
			let stdDev = NumberUtil.roundTo( MathUtil.standardDeviation( items, "population" ), 2);
			r.forEach( (item) => {
				resultItem.upper = NumberUtil.roundTo( item.sma + (2 * stdDev), 2 );
				resultItem.middle = item.sma;
				resultItem.lower = NumberUtil.roundTo( item.sma - (2 * stdDev), 2 );
			});
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;

			idx++;
		}

		return results;
	}
}

module.exports = BB;
