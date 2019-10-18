'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const SMA = require('./simple-moving-average');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function SO( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: SO() must be called with new');

	this._options = {
		periods:14,
		smaPeriods: 3,
		startIndex: null,
		endIndex: null,
		sliceOffset: false,
		lazyEvaluation: true,
		maxTickDuration: 10,
	}

	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
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
		return this._handleGenerator( this._compute() );
	},

	_compute: function * (){
		let results = [];
		let k_results = [];

		let {periods, smaPeriods, startIndex, endIndex, sliceOffset, lazyEvaluation} = this._options;

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		if( ! sliceOffset ){
			for( let i=startIndex; i<startIndex+periods; i++ ){
				let resultItem = {k:0, d:0, price: this._collection[ i ] };
				results.push( resultItem );
				if( lazyEvaluation ) yield resultItem;
			}
		}

		if( startIndex + periods > endIndex ){
			throw new Error('ERROR: Out of Range');
		}

		for( let i=startIndex + periods; i<=endIndex; i++ ){
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
				let sma = new SMA( { periods: smaPeriods, lazyEvaluation: false, sliceOffset: true } );
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
			let resultItem = {k, d, price: currentPrice };
			results.push( resultItem );

			if( lazyEvaluation ) yield resultItem;
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
