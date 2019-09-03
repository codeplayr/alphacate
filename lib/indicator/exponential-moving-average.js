'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function EMA( options = {} ){
	if (! new.target ) throw new Error('ERROR: EMA() must be called with new');
	this._options = {
		startIndex: 0,
		endIndex: null,
		periods: 12,
		emaResultsOnly: false,
		startWithFirst: false,
		sliceOffset: true,
	};
	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
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
		return this._compute();
	},

	_compute(){
		let results = [];
		let firstVal = 0;

		let {startIndex, endIndex, periods, startWithFirst} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		if( startWithFirst ){
			firstVal =  this._collection[ startIndex ];
		}
		else{
			firstVal = this._avg( startIndex, startIndex + periods - 1 );
			if( ! this._options.sliceOffset ){
				for(let i=startIndex; i<startIndex + periods - 1; i++){
					results.push({price: this._collection[ i ], ema: 0 });
				}
			}
			startIndex = startIndex + periods - 1;
		}

		results.push({
			price: this._collection[ startIndex ],
			ema: firstVal,
		});

		let z  = 1;
		let multiplier = 2 / ( periods + 1);
		for( let i=startIndex + 1; i<=endIndex; i++ ){
			let ema = (this._collection[ i ] * multiplier) + (results[ results.length - 1 ].ema * ( 1 - multiplier ) );
			results.push({
				price: this._collection[ i ],
				ema: NumberUtil.roundTo( ema, 2),
			});
			z++;
		}

		if( this._options.emaResultsOnly ) return _.pluck( results, 'ema');
		return results;
	},

	_avg( indexStart, indexEnd ){
		if( ! _.isNumber( indexStart ) || (indexStart >= indexEnd) ) throw new Error('Error: Invalid indexStart argument');
		if( ! _.isNumber( indexEnd ) )	throw new Error('Error: Invalid indexEnd argument');

		let coll_len = this._collection.length;
		if( coll_len - 1 < indexStart || coll_len - 1 < indexEnd ) throw new Error('Error: Invalid collection length');

		let n = 0;
		for( let i=indexStart; i<=indexEnd; i++ )	n += this._collection[ i ];
		return NumberUtil.roundTo( n / (indexEnd - indexStart + 1), 2 );
	}
}

module.exports = EMA;
