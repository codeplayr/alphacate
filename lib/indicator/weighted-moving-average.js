'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function WMA( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: WMA() must be called with new');
	this._options = {
		startIndex: null,
		endIndex: null,
		periods: 14,
		sliceOffset: false,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};
	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
};

WMA.prototype = {

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
		let weight = this._getWeight();

		let convertToResultItem = ( price, value ) => {
			return {
				price,
				wma: NumberUtil.roundTo( value, 2),
			};
		};

		let {startIndex, endIndex, periods, sliceOffset, lazyEvaluation} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let resultItem = null;

		if( ! sliceOffset ){
			for( let i=startIndex; i<startIndex+periods-1; i++ ){
				resultItem = convertToResultItem( this._collection[ i ], 0 );
				results.push( resultItem );
				if( lazyEvaluation ) yield resultItem;
			}
		}
		
		for(let i=startIndex + periods - 1; i<=endIndex; i++){
			let sum = 0;
			let cnt = 1;
			for(let j=i-periods+1; j<=i; j++){
				sum += this._collection[ j ] * cnt;
				cnt++;
			}
			resultItem = convertToResultItem( this._collection[ i ], sum / weight );
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
		}

		return results;
	},

	_getWeight(){
		let weight = 1;
		let cnt = 1;
		while( cnt < this._options.periods ) weight += ++cnt;
		return weight;
	}	

}

module.exports = WMA;
