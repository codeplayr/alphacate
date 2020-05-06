'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const SMA = require('./simple-moving-average');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');
const EMA = require('./exponential-moving-average');


function TRIX( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: TRIX() must be called with new');

	this._options = {
		periods:15,
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


TRIX.prototype = {

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
}

module.exports = TRIX;
