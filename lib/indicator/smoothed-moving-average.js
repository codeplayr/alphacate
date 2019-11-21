'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');
const SMA = require('./simple-moving-average');

function SMMA( options = {} ){
	if (! new.target ) throw new Error('ERROR: SAR() must be called with new');
	this._options = {
		periods: 20,
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

SMMA.prototype = {

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

		let convertToResultItem = ( price, value ) => {
			return {
				price: price,
				smma: NumberUtil.roundTo( value, 2),
			};
		};

		let {periods, startIndex, endIndex, sliceOffset, lazyEvaluation} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		if( ! sliceOffset ){
			for(let i=startIndex; i<startIndex + periods - 1; i++){
				let resultItem = convertToResultItem( this._collection[ i ], 0 );
				results.push( resultItem );

				if( lazyEvaluation ) yield resultItem;
			}
		}

		let sma = new SMA( {periods, startIndex, endIndex: startIndex + periods - 1, lazyEvaluation: false, sliceOffset: true} );
		sma.setValues( this._collection );
		let smaResults = sma.calculate();
		let smma1 = smaResults[0].sma;

		let resultItem = convertToResultItem( smaResults[0].price, smma1 );
		results.push( resultItem );
		if( lazyEvaluation ) yield resultItem;

		let price = this._collection[ startIndex + periods ];
		let smma2 = ( smma1 * ( periods - 1 )  + price) / periods;
		resultItem = convertToResultItem( price, smma2 );
		results.push( resultItem );
		if( lazyEvaluation ) yield resultItem;

		for( let i=startIndex+periods+1; i<=endIndex; i++ ){
			let prevSMMA = results[ results.length - 1 ].smma;
			let prevSum = prevSMMA * periods;
			let currentPrice = this._collection[ i ];
			let smma = ( prevSum - prevSMMA  + currentPrice) / periods;
			let resultItem = convertToResultItem( currentPrice, smma );
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
		}

		return results;
	},

}

module.exports = SMMA;
