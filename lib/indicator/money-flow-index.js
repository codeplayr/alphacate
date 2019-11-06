'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function MFI( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: MFI() must be called with new');

	this._options = {
		startIndex: null,
		endIndex: null,
		periods: 14,
		sliceOffset: false,
		lazyEvaluation: true,
		maxTickDuration: 10,
	}

	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
};

MFI.prototype = {

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

		let {periods, startIndex, endIndex, sliceOffset, lazyEvaluation} =  this._options;

		let convertToResultItem = ( typicalPrice, rawMoneyFlow, positiveMoneyFlow, negativMoneyFlow, periodPositiveMoneyFlow = 0, periodNegativeMoneyFlow = 0 ) => {
			let moneyFlowRatio = 0;
			let moneyFlowIndex = 0;

			if( periodPositiveMoneyFlow && periodNegativeMoneyFlow ){
				moneyFlowRatio = periodPositiveMoneyFlow / periodNegativeMoneyFlow;
				moneyFlowIndex = 100 - ( 100 / ( 1 + moneyFlowRatio ) );

				//alternative
				//moneyFlowIndex = 100 * ( periodPositiveMoneyFlow / ( periodPositiveMoneyFlow + periodNegativeMoneyFlow ) );
		 	}

			return {
				typicalPrice: NumberUtil.roundTo( typicalPrice, 2 ),
				rawMoneyFlow,
				positiveMoneyFlow,
				negativMoneyFlow,
				moneyFlowRatio: NumberUtil.roundTo( moneyFlowRatio, 2 ),
				moneyFlowIndex: NumberUtil.roundTo( moneyFlowIndex, 2 ),
				periodPositiveMoneyFlow,
				periodNegativeMoneyFlow,
			};
		};

		if( ! NumberUtil.isNumeric( startIndex ) ) startIndex = 0;
		if( ! NumberUtil.isNumeric( endIndex ) ) endIndex = this._collection.length - 1;

		let prevTypicalPrice;

		for( let i=startIndex; i<=endIndex; i++){
			let item = this._collection[ i ];
			let typicalPrice = (item.high + item.low + item.close) / 3;

			let rawMoneyFlow =  Math.round( typicalPrice * item.volume );

			let positiveMoneyFlow = 0;
			let negativMoneyFlow = 0;

			if( i > startIndex ){
				if( typicalPrice > prevTypicalPrice ) positiveMoneyFlow = rawMoneyFlow;
				if( typicalPrice < prevTypicalPrice ) negativMoneyFlow = rawMoneyFlow;
			}

			let periodPositiveMoneyFlow = 0;
			let periodNegativeMoneyFlow = 0;
			if( i >= startIndex + periods ){
				let items = results.slice( results.length - periods + 1 );
				let {sumPositiveMoneyFlow, sumNegativeMoneyFlow} = this._calcPeriodMoneyFlow( items );
				periodPositiveMoneyFlow = sumPositiveMoneyFlow + positiveMoneyFlow;
				periodNegativeMoneyFlow = sumNegativeMoneyFlow + negativMoneyFlow;
			}

			let resultItem = convertToResultItem( typicalPrice, rawMoneyFlow, positiveMoneyFlow, negativMoneyFlow, periodPositiveMoneyFlow, periodNegativeMoneyFlow );
			resultItem.high = item.high;
			resultItem.low = item.low;
			resultItem.close = item.close;
			resultItem.volume = item.volume;

			results.push( resultItem );

			if( lazyEvaluation ){
				if( sliceOffset ){
					if( i >= startIndex + periods )  yield resultItem;
				}
				else yield resultItem;
			}
			
			prevTypicalPrice = typicalPrice;
		}

		return ( sliceOffset ) ? results.slice( startIndex + periods ) : results;
	},

	_calcPeriodMoneyFlow( collection ){
		let sumPositiveMoneyFlow = 0;
		let sumNegativeMoneyFlow = 0;
		for(let i=0; i<collection.length; i++){
			let item = collection[i];
			sumPositiveMoneyFlow += item.positiveMoneyFlow;
			sumNegativeMoneyFlow += item.negativMoneyFlow;
		}
		return {sumPositiveMoneyFlow, sumNegativeMoneyFlow};
	},

};

module.exports = MFI;
