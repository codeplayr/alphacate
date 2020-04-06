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

};

module.exports = ADL;
