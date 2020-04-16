'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function ADL( options = {} ){
    if (! new.target ) throw new Error( 'ERROR: ADL() must be called with new');

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

ADL.prototype = {

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

		let convertToResultItem = ( close, mfMultiplier, mfVolume, adl ) => {
			return {
				price: close,
				mfMultiplier,
				mfVolume,
				adl: Math.round( adl ),
			};
		};

		let {startIndex, endIndex, lazyEvaluation} = this._options;

		if( _.isNull( startIndex ) ) startIndex  = 0;
		if( _.isNull( endIndex ) ) endIndex = this._collection.length - 1;

		for( let i=startIndex; i<=endIndex; i++ ){
			let item = this._collection[ i ];
			let mfMultiplier = ((item.close - item.low) - (item.high - item.close)) / ( item.high - item.low );
			mfMultiplier = NumberUtil.roundTo( mfMultiplier, 4);
			let mfVolume = Math.round( mfMultiplier * item.volume);

			let prevAdl = 0;
			if( i != startIndex ) prevAdl = results[ results.length - 1 ].adl;
			let adl = prevAdl + mfVolume;
			let resultItem = convertToResultItem( item.close, mfMultiplier, mfVolume, adl );
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
		}
		
		return results;
	},	

};

module.exports = ADL;
