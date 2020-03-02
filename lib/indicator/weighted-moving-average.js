'use strict';

const _ = require('underscore');
const NumberUtil = require('./../utils/number');
const ValidateMixin = require('./../mixin/validate');
const SetOptionsMixin = require('./../mixin/set-options');
const HandleGeneratorMixin = require('./../mixin/handle-generator');

function WMA( options = {} ){
	if (! new.target ) throw new Error( 'ERROR: WMA() must be called with new');
	this._options = {
		startIndex: null,
		endIndex: null,
		periods: 14,
		sliceOffset: false,
		lazyEvaluation: true,
		maxTickDuration: 10,
	};
	let m = [SetOptionsMixin, ValidateMixin, HandleGeneratorMixin];
	Object.assign(this, ...m);
	this.setOptions( options );
	this._collection = [];
};


module.exports = WMA;
