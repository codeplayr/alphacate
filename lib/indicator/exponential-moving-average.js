'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function EMA( options = {} ){
	if (! new.target ) throw new Error('ERROR: EMA() must be called with new');
	this._options = {
		startIndex: 0,
		endIndex: null,
		periods: 12,
		emaResultsOnly: false,
		startWithFirst: false,
		sliceOffset: true,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};
	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
}

EMA.prototype = {

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

	_compute: function * (){
		let results = [];
		let firstVal = 0;

		let {startIndex, endIndex, periods, startWithFirst, lazyEvaluation, floating} = this._options;

		let convertToResultItem = ( price, ema ) => {
			return {price, ema: NumberUtil.roundTo(ema, 2) };
		}

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		if( startWithFirst ){
			firstVal =  this._collection[ startIndex ];
		}
		else{
			firstVal = this._avg( startIndex, startIndex + periods - 1 );
			if( ! this._options.sliceOffset ){
				for(let i=startIndex; i<startIndex + periods - 1; i++){
					let resultItem = convertToResultItem( this._collection[ i ], 0 );
					results.push( resultItem );
					if( lazyEvaluation ) yield resultItem;
				}
			}
			startIndex = startIndex + periods - 1;
		}

		let resultItem = convertToResultItem( this._collection[ startIndex ], firstVal );
		results.push( resultItem );
		if( lazyEvaluation ) yield resultItem;

		let z  = 1;
		let multiplier = 2 / ( periods + 1);
		for( let i=startIndex + 1; i<=endIndex; i++ ){
			let ema = (this._collection[ i ] * multiplier) + (results[ results.length - 1 ].ema * ( 1 - multiplier ) );
			let resultItem = convertToResultItem( this._collection[ i ], ema );
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
			z++;
		}

		if( ! lazyEvaluation ){
			if( this._options.emaResultsOnly ) return _.pluck( results, 'ema');
			return results;
		}
	},

	_avg( indexStart, indexEnd ){
		if( ! _.isNumber( indexStart ) || (indexStart >= indexEnd) ) throw new Error('Error: Invalid indexStart argument');
		if( ! _.isNumber( indexEnd ) )	throw new Error('Error: Invalid indexEnd argument');

		let coll_len = this._collection.length;
		if( coll_len - 1 < indexStart || coll_len - 1 < indexEnd ) throw new Error('Error: Invalid collection length');

		let n = 0;
		for( let i=indexStart; i<=indexEnd; i++ )	n += this._collection[ i ];
		return (n / (indexEnd - indexStart + 1));
	}
}

module.exports = EMA;
