'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const SMA = require('./simple-moving-average');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function ROC( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: ROC() must be called with new');

	this._options = {
		periods:14,
		startIndex: null,
		endIndex: null,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};
	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
}

ROC.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		this._collection = values;
	},

	calculate(){
		this._validate( this._collection, this._options );
		return this._handleGenerator( this._compute() );
	},

	_compute: function * (){
		let results = [];
		let {startIndex, endIndex, periods, lazyEvaluation} = this._options;

		if( ! NumberUtil.isNumeric ( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let resultItem = null;

		for( let i=startIndex; i<=endIndex; i++ ){
			let currentPrice = this._collection[ i ];
			if( i <= startIndex + periods - 1){
				resultItem = {roc: 0, price: currentPrice};
				results.push( resultItem );
				if( lazyEvaluation ) yield resultItem;
				continue;
			}
			let prevPrice = this._collection[ i - periods ];
			let roc = (( currentPrice - prevPrice ) / prevPrice) * 100;
			resultItem = {roc: NumberUtil.roundTo( roc, 2), price: currentPrice };
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
		};

		return results;
	},
}

module.exports = ROC;
