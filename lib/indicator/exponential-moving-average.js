'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');

function EMA( options = {} ){
	if (! new.target ) throw new Error('ERROR: EMA() must be called with new');
	this._options = {range: 12, emaResultsOnly: false, startWithFirst: false};
	this.setOptions( options );
	this._collection = [];
}

EMA.prototype = {
	add(price, date = null){
		if( ! NumberUtil.isNumeric( price ) ) throw new Error('ERROR: Invalid price argument');
		let item = {price: Number(price),date: date || null,ema: 0};
		this._collection.push( item );
	},

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		values.forEach( (val) => this.add( val ) );
	},

	setOptions( options = {} ){
		if( ! _.isObject( options ) ) throw new Error('ERROR: Invalid Options argument');
		if( _.isEmpty( options ) ) return;
		this._options = _.extend( {}, this._options, options );
	},

	clear(){
		this._collection = [];
	},

	calculate(){
		this._validate();
		return this._compute();
	},

	_compute(){
		let multiplier = 2 / ( this._options.range + 1)
		let indexStart = null;
		let indexVal = 0;

		if( (this._collection.length - this._options.range) < 0 || this._options.startWithFirst ){
			indexVal =  this._collection[0].price;
			indexStart = 0;
		}
		else{
			let sma = this._avg( 0, this._options.range - 1 );
			indexVal =  sma;
			indexStart = this._options.range - 1;
		}

		let indexEnd = this._collection.length;
		let result = this._collection.slice(indexStart, indexEnd);
		result[0].ema = indexVal;

		let z = 1;
		for( let i = indexStart + 1; i < indexEnd; i++ ){
			let ema = (this._collection[ i ].price * multiplier) + (result[ z - 1 ].ema * ( 1 - multiplier ) );
			result[ z ].ema = NumberUtil.roundTo( ema, 2);
			z++;
		}

		if( this._options.emaResultsOnly ) return _.pluck( result, 'ema');
		return result;
	},

	_validate(){
		if( this._collection.length <= 2 ) throw new RangeError('ERROR: Collection length must be greater than 2');

		return true;
	},

	_avg( indexStart, indexEnd ){
		if( ! _.isNumber( indexStart ) || (indexStart >= indexEnd) ) throw new Error('Error: Invalid indexStart argument');
		if( ! _.isNumber( indexEnd ) )	throw new Error('Error: Invalid indexEnd argument');

		let coll_len = this._collection.length;
		if( coll_len - 1 < indexStart || coll_len - 1 < indexEnd ) throw new Error('Error: Invalid collection length');

		let n = 0;
		for( let i=indexStart; i<=indexEnd; i++ )	n += this._collection[ i ].price;
		return NumberUtil.roundTo( n / (indexEnd - indexStart + 1), 2 );
	}
}

module.exports = EMA;
