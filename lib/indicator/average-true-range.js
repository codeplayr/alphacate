'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const MathUtil = require('./../utils/math');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function ATR( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: ATR() must be called with new');

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

ATR.prototype = {

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
		let {periods, startIndex, endIndex} = this._options;

		if( _.isNull( startIndex ) ) startIndex  = 0;
		if( _.isNull( endIndex ) ) endIndex = this._collection.length - 1;

		for( let i=startIndex; i<=endIndex; i++){
			let item = this._collection[ i ];
			let prevItem = ( i > startIndex ) ? this._collection[ i -1 ] : null;
			let tr = this._getTrueRange( item, prevItem );
			let atr = 0;

			if( i < ( startIndex + periods - 1 ) ){
				//do nothing
			}
			else if( i == (startIndex + periods - 1) ){
				let trCollection = results.slice( startIndex, startIndex + periods + 2 );
				atr = this._calcFirstATR( trCollection );
			}
			else{
				let prevATR = results[ results.length - 1 ].atr;
				atr = this._calcRemainingATR( prevATR, tr, periods );
			}

			results.push( {tr: NumberUtil.roundTo(tr,2), atr: NumberUtil.roundTo(atr,2)} );
		};

		return results;
	},

	_getTrueRange( currItem, prevItem = null ){
		if(  !_.isNull(prevItem) && ! _.isObject( currItem ) ){
			throw new Error('ERROR: invalid param, not an object');
		}

		if( ! _.has(currItem, 'high' ) || ! _.has(currItem, 'low') || ! _.has(currItem, 'close') ){
			throw new Error('ERROR: invalid oject property');
		}

		let diff_1 = (prevItem) ? NumberUtil.roundTo( Math.abs( currItem.high - prevItem.close ), 2 ) : 0;
		let diff_2 = (prevItem) ? NumberUtil.roundTo( Math.abs( currItem.low - prevItem.close ), 2 ) : 0;
		let diff_3 = NumberUtil.roundTo( currItem.high - currItem.low, 2 );

		let max = diff_1;
		if( max < diff_2 ) max = diff_2;
		if( max < diff_3 ) max = diff_3;

		return max;
	},

	_calcFirstATR( trueRangeCollection ){
		let sum = 0 ;

		trueRangeCollection.forEach( (item, idx) => {
			sum += item.tr;
		});

		return (sum / trueRangeCollection.length);
	},

	_calcRemainingATR( prevATR, currTR, periods ){
		return (prevATR * ( periods - 1 ) + currTR) / periods;
	},

};

module.exports = ATR;
