'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const SMA = require('./simple-moving-average');

function SO( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: SO() must be called with new');

	this._options = {
		periods:14,
		smaPeriods: 3,
		startIndex: null,
		endIndex: null,
	}
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
		let {periods, startIndex, endIndex} = this._options;

		if( _.isEmpty(this._collection) ){
			throw new Error('ERROR: No data');
		}

		if( periods > this._collection.length ){
			throw new Error('ERROR: periods option must be lower than values list length');
		}

		if( ! NumberUtil.isNumeric( periods ) || periods <= 1 ){
			throw new Error('ERROR: Invalid periods options');
		}

		if( ! _.isNull( startIndex ) && startIndex >= endIndex ){
			throw new Error('ERROR: startIndex must be lower than endIndex');
		}

		if( ! _.isNull( startIndex ) && startIndex > (this._collection.length - 1) ){
			throw new Error('ERROR: startIndex out of range');
		}

		if( ! _.isNull( endIndex ) && endIndex > (this._collection.length - 1) ){
			throw new Error('ERROR: endIndex out of range');
		}

		if( ! _.isNull( startIndex ) && ! NumberUtil.isNumeric( startIndex ) ){
			throw new Error('ERROR: invalid startIndex option type');
		}

		if( NumberUtil.isNumeric(startIndex ) && startIndex < 0 ){
			throw new Error('ERROR: starIndex option must be greater or equal 0');
		}

		if( ! _.isNull( endIndex ) && ! NumberUtil.isNumeric( endIndex ) ){
			throw new Error('ERROR: invalid endIndex option type');
		}

		if( NumberUtil.isNumeric( endIndex ) && endIndex < 0  ){
			throw new Error('ERROR: endIndex option must be greater or equal 0');
		}

		if( NumberUtil.isNumeric( startIndex ) && ( startIndex - periods) < 0 ){
			throw new Error('ERROR: Invalid startIndex option, startIndex must be greater than periods');
		}

		if( NumberUtil.isNumeric( startIndex ) && NumberUtil.isNumeric( endIndex ) ){
			if( endIndex <= startIndex ){
				throw new Error('ERROR: Invalid endIndex option, out of range');
			}
		}
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
				let sma = new SMA( { timePeriods: smaPeriods } );
				let smaCollection = k_results.slice( smaStartRangeIndex, smaEndRangeIndex + 1 );
				sma.setValues( smaCollection );
				let smaResult = sma.calculate();
				if( Array.isArray( smaResult ) && smaResult.length == 1 ){
					d = NumberUtil.roundTo( smaResult[0], 2);
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
