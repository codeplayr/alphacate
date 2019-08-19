'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function OBV( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: OBV() must be called with new');

	this._options = {
		startIndex: null,
		endIndex: null,
	}

	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
}

OBV.prototype = {

	add( price, volume ){
		this._collection.push( {price, volume} );
	},

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}

		values.forEach( (item) => {
			if( _.has( item, 'price' ) && _.has( item, 'volume' ) ){
				this.add( item.price, item.value );
			}
			else throw new Error('ERROR: Invalid value');
		});

	},

	calculate(){
		this._validate( this._collection, this._options );
		return this._compute();
	},

	_compute(){
		let result = [];
		let sum = 0;
		let {startIndex, endIndex} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let collection = this._collection.slice( startIndex, endIndex + 1 );

		collection.forEach( function( item, idx ){
			if( ! idx  ) return result.push( 0 );

			let prevItem = collection[ idx - 1 ];
			let currItem = collection[ idx ];

			if( prevItem.price > currItem.price ) sum -=  currItem.volume;
			else if( prevItem.price < currItem.price ) sum += currItem.volume;

			result.push( sum );
		});

		return result;
	},

}

module.exports = OBV;
