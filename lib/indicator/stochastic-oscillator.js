'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const SMA = require('./simple-moving-average');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');

function SO( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: SO() must be called with new');

	this._options = {
		periods:14,
		smaPeriods: 3,
		startIndex: null,
		endIndex: null,
	}
	Object.assign(this, SetOptionsMixin);
	this.setOptions( options );
	this._collection = [];
	Object.assign(this, ValidateMixin);
}

SO.prototype = {

	setValues( values ){
		if( ! Array.isArray( values )){
			throw new Error('ERROR: values param is not an array');
		}
		this._collection = values;
	},

	calculate(){
		this._validate( this._collection, this._options );
		return this._compute();
	},

	_compute(){
		let results = [];
		let k_results = [];

		let {periods, smaPeriods, startIndex, endIndex} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0 + periods;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		for( let i=startIndex; i<=endIndex; i++ ){
			let currentPrice  = this._collection[ i ];
			let pastRangeStart = i - periods;
			let pastRangeEnd = i - 1;
			let resultLowest = this._findPrice( 'lowest', pastRangeStart, pastRangeEnd );
			let resultHighest = this._findPrice('highest', pastRangeStart, pastRangeEnd );

			let k = ((currentPrice - resultLowest) / ( resultHighest - resultLowest )) * 100;
			k = NumberUtil.roundTo( k, 2 );
			let d = 0;

			if( k_results.length > smaPeriods ){
				let smaStartRangeIndex = k_results.length - smaPeriods;
				let smaEndRangeIndex = k_results.length - 1;
				let sma = new SMA( { periods: smaPeriods } );
				let smaCollection = k_results.slice( smaStartRangeIndex, smaEndRangeIndex + 1 );
				sma.setValues( smaCollection );
				let smaResult = sma.calculate();
				if( Array.isArray( smaResult ) && smaResult.length == 1 ){
					d = NumberUtil.roundTo( smaResult[0].sma, 2);
				}
				else{
					throw new Error('ERROR: calculated SMA value invalid');
				}
			}

			k_results.push( k );
			results.push( {k, d, price: currentPrice } );
		}

		return results;
	},

	_findPrice( type, startIndex, endIndex ){
		let idx = startIndex;
		let resultPrice = null;

		while( idx <= endIndex ){
			let currentPrice = this._collection[ idx ];
			if( idx == startIndex ){
				resultPrice = currentPrice;
				idx++;
				continue;
			}

			switch( type ){
				case 'lowest':
					if(  currentPrice < resultPrice ) resultPrice = currentPrice;
					break;

				case 'highest':
					if( currentPrice > resultPrice ) resultPrice = currentPrice;
					break;
			}

			idx++;
		}
		return resultPrice;
	},

}

module.exports = SO;
