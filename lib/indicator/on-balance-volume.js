'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');

function OBV( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: OBV() must be called with new');

	this._options = {
		startIndex: null,
		endIndex: null,
	}
	this.setOptions( options );
	this._collection = [];
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

	setOptions( options ){
		if( ! _.isObject( options ) ){
			throw new Error('ERROR: Invalid Options argument');
		}

		if( _.isEmpty( options ) ){
			return;
		}

		this._options = _.extend( {}, this._options, options );
	},

	calculate(){
		this._validate();
		return this._compute();
	},

	_validate(){
		if( _.isEmpty(this._collection) ){
			throw new Error('ERROR: No data');
		}

		if( ! _.isNull( this._options.startIndex ) && this._options.startIndex >= this._options.endIndex ){
			throw new Error('ERROR: startIndex must be lower than endIndex');
		}

		if( ! _.isNull( this._options.startIndex ) && this._options.startIndex > (this._collection.length - 1) ){
			throw new Error('ERROR: startIndex out of range');
		}

		if( ! _.isNull( this._options.endIndex ) && this._options.endIndex > (this._collection.length - 1) ){
			throw new Error('ERROR: endIndex out of range');
		}

		if( ! _.isNull( this._options.startIndex ) && ! NumberUtil.isNumeric( this._options.startIndex ) ){
			throw new Error('ERROR: invalid startIndex option type');
		}

		if( NumberUtil.isNumeric(this._options.startIndex ) && this._options.startIndex < 0 ){
			throw new Error('ERROR: starIndex option must be greater or equal 0');
		}

		if( ! _.isNull( this._options.endIndex ) && ! NumberUtil.isNumeric( this._options.endIndex ) ){
			throw new Error('ERROR: invalid endIndex option type');
		}

		if( NumberUtil.isNumeric(this._options.endIndex ) && this._options.endIndex < 0  ){
			throw new Error('ERROR: endIndex option must be greater or equal 0');
		}
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
