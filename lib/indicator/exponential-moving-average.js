'use strict';

var _ = require('underscore');
var NumberUtil = require('./../utils/number');

var EMA = function( options = {} ){
	if (! new.target ) throw new Error('ERROR: EMA() must be called with new');
	this._options = {range: 12, emaResultsOnly: false, startWithFirst: false};
	this._setOptions( options );
	this._collection = [];
}

EMA.prototype.add = function(price, date = null){
	if( ! NumberUtil.isNumeric( price ) ) throw new Error('ERROR: Invalid price argument');
	var item = {price: Number(price),date: date || null,ema: 0};
	this._collection.push( item );
}

EMA.prototype.calculate = function( options = {} ){
	this._setOptions( options );
	if( this._collection.length <= 2 ) throw new RangeError('ERROR: Collection length must be greater than 2');

	var multiplier = 2 / ( this._options.range + 1)
	var indexStart = null;
	var indexVal = 0;

	if( (this._collection.length - this._options.range) < 0 || this._options.startWithFirst ){
		indexVal =  this._collection[0].price;
		indexStart = 0;
	}
	else{
		var sma = this._avg( 0, this._options.range - 1 );
		indexVal =  sma;
		indexStart = this._options.range - 1;
	}

	var indexEnd = this._collection.length;
	var result = this._collection.slice(indexStart, indexEnd);
	result[0].ema = indexVal;

	var z = 1;
	for( let i = indexStart + 1; i < indexEnd; i++ ){
		let ema = (this._collection[ i ].price * multiplier) + (result[ z - 1 ].ema * ( 1 - multiplier ) );
		result[ z ].ema = NumberUtil.roundTo( ema, 2);
		z++;
	}

	if( this._options.emaResultsOnly ) return _.pluck( result, 'ema');
	return result;
}

EMA.prototype._setOptions = function( options = {} ){
	if( ! _.isObject( options ) ) throw new Error('ERROR: Invalid Options argument');
	if( _.isEmpty( options ) ) return;
	this._options = _.extend( {}, this._options, options );
}

EMA.prototype._avg = function( indexStart, indexEnd ){
	if( ! _.isNumber( indexStart ) || (indexStart >= indexEnd) ) throw new Error('Error: Invalid indexStart argument');
	if( ! _.isNumber( indexEnd ) )	throw new Error('Error: Invalid indexEnd argument');

	var coll_len = this._collection.length;
	if( coll_len - 1 < indexStart || coll_len - 1 < indexEnd ) throw new Error('Error: Invalid collection length');

	var n = 0;
	for( let i=indexStart; i<=indexEnd; i++ )	n += this._collection[ i ].price;
	return NumberUtil.roundTo( n / (indexEnd - indexStart + 1), 2 );
}

module.exports = EMA;
