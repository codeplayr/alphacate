'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const MathUtil = require('./../utils/math');
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
		
		let {startIndex, endIndex, lazyEvaluation} = this._options;

		if( _.isNull( startIndex ) ) startIndex  = 0;
		if( _.isNull( endIndex ) ) endIndex = this._collection.length - 1;

		return results;
	},	

};

module.exports = ADL;
