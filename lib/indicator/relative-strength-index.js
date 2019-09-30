'use strict';
const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function RSI( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: RSI() must be called with new');
	this._options ={
		startIndex: null,
		endIndex: null,
		periods: 14,
		sliceOffset: true,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};

	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
};

RSI.prototype = {

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
		return this._handleGenerator( this._compute() );
	},

	_compute: function * (){
		let results = [];

		let {periods, startIndex, endIndex, sliceOffset, lazyEvaluation} =  this._options;

		let convertToResultItem = ( price, gain = null, loss = null, avg_gain = null, avg_loss = null ) => {
			let rs = null;
			let rsi = null;

			if( NumberUtil.isNumeric( avg_gain ) && NumberUtil.isNumeric( avg_loss ) ){
				rs = avg_gain / avg_loss;
				rsi = 100 - ( 100 / ( 1 + rs ) );
			}

			return {
				price,
				gain: NumberUtil.isNumeric(gain) ? NumberUtil.roundTo( gain, 2 ) : null,
				loss: NumberUtil.isNumeric(loss) ? NumberUtil.roundTo( loss, 2 ) : null,
				avg_gain: NumberUtil.isNumeric(avg_gain) ? NumberUtil.roundTo( avg_gain, 2 ) : null,
				avg_loss: NumberUtil.isNumeric(avg_loss) ?  NumberUtil.roundTo( avg_loss, 2 ) : null,
				rs:  NumberUtil.isNumeric(rs) ? NumberUtil.roundTo( rs, 2 ) : null,
				rsi: NumberUtil.isNumeric(rsi) ? NumberUtil.roundTo( rsi, 2 ) : null,
			};
		};

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let sumPeriodGain = 0;
		let sumPeriodLoss = 0;

		for( let i=startIndex, endPeriodIndex=startIndex+periods-1; i<=endPeriodIndex; i++ ){
			let resultItem = null;

			if( i == startIndex ){
				resultItem = convertToResultItem( this._collection[ i ], 0, 0 );
			}
			else{
				let {gain, loss} = this._calcGainLoss( i );
				sumPeriodGain += gain;
				sumPeriodLoss += loss;
				resultItem = convertToResultItem( this._collection[ i ], gain, loss );
			}

			if( ! sliceOffset ){
				results.push( resultItem );
				if( lazyEvaluation ) yield resultItem;
			}
		}

		let ag = sumPeriodGain  / periods;
		let al = sumPeriodLoss  / periods;
		let {gain, loss} = this._calcGainLoss( startIndex + periods );
		let resultItem = convertToResultItem( this._collection[ startIndex + periods ], gain, loss, ag, al );
		results.push( resultItem );
		if( lazyEvaluation ) yield resultItem;

		for(let i=startIndex + periods + 1; i<=endIndex; i++ ){
			let {gain, loss} = this._calcGainLoss( i );
			let prev_avg_gain = results[ results.length - 1 ].avg_gain;
			let prev_avg_loss = results[ results.length - 1 ].avg_loss;
			let ag = ((prev_avg_gain * (periods - 1) ) + gain  ) / periods;
			let al = ((prev_avg_loss * (periods - 1) ) + loss ) / periods;
			let resultItem = convertToResultItem( this._collection[ i ], gain, loss, ag, al );
			results.push( resultItem );
			if( lazyEvaluation ) yield resultItem;
		}

		if( ! lazyEvaluation ){
			return results;
		}
	},

	_calcGainLoss( collectionIndex ){
		let result = {gain: 0, loss: 0};
		if( collectionIndex>=0 && collectionIndex<this._collection.length){
			if( collectionIndex > 0 ){
				let diff = this._collection[ collectionIndex ] - this._collection[ collectionIndex - 1 ];
				if( diff > 0 ) result.gain = diff;
				else result.loss =  Math.abs(diff);
			}
		}
		else throw new Error('ERROR: index is outside the collection range');
		return result;
	},

}

module.exports = RSI;
