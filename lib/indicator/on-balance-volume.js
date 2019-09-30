'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function OBV( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: OBV() must be called with new');

	this._options = {
		startIndex: null,
		endIndex: null,
		lazyEvaluation: true,
		maxTickDuration: 10,
	}

	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
}

OBV.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}

		values.forEach( (item) => {
			if( _.has( item, 'price' ) && _.has( item, 'volume' ) ){
				let {price, volume} = item;
				this._collection.push( {price, volume} );
			}
			else throw new Error('ERROR: Invalid value');
		});
	},

	calculate(){
		this._validate( this._collection, this._options );
		return this._handleGenerator( this._compute() );
	},

	_compute: function * (){
		let result = [];
		let sum = 0;
		let {startIndex, endIndex, lazyEvaluation} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let collection = this._collection.slice( startIndex, endIndex + 1 );

		for(let i=0; i<collection.length; i++){
			let currItem = collection[ i ];

			let resultItem = {
				obv: 0,
				price: currItem.price,
			};

			if( ! i  ){
				result.push( resultItem );
				yield resultItem;
				continue;
			}

			let prevItem = collection[ i - 1 ];

			if( prevItem.price > currItem.price ) sum -=  currItem.volume;
			else if( prevItem.price < currItem.price ) sum += currItem.volume;

			resultItem.obv = sum;
			result.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
		};

		return result;
	},

}

module.exports = OBV;
