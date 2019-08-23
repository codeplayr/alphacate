'use strict';

const NumberUtil = require('./../utils/number');
const _ = require('underscore');

module.exports = {

	_validate( collection = null, options = null ){

		let hasCollection = false;
		let hasOptions = false;

		if( Array.isArray( collection ) ){
			hasCollection = true;
		}

		if(  _.isObject( options ) ){
			hasOptions = true;
		}

		if( hasCollection && _.isEmpty(collection) ){
			throw new Error('ERROR: No data');
		}

		if( hasOptions && hasCollection && _.has( options, 'periods' ) ){
			if( options.periods > collection.length ){
				throw new Error('ERROR: periods option must be lower than values list length');
			}
			if( ! NumberUtil.isNumeric( options.periods ) || options.periods <= 1 ){
				throw new Error('ERROR: Invalid periods options');
			}
		}

		if( hasOptions && _.has( options, 'startIndex' ) ){
			if( ! _.isNull( options.startIndex ) && ! NumberUtil.isNumeric( options.startIndex ) ){
				throw new Error('ERROR: invalid startIndex option type');
			}
			if( NumberUtil.isNumeric(options.startIndex ) && options.startIndex < 0 ){
				throw new Error('ERROR: starIndex option must be greater or equal 0');
			}
		}

		if( hasOptions && _.has( options, 'endIndex' ) ){
			if( ! _.isNull( options.endIndex ) && ! NumberUtil.isNumeric( options.endIndex ) ){
				throw new Error('ERROR: invalid endIndex option type');
			}
			if( NumberUtil.isNumeric(options.endIndex ) && options.endIndex < 0  ){
				throw new Error('ERROR: endIndex option must be greater or equal 0');
			}
		}

		if( hasOptions && _.has( options, 'startIndex' ) && _.has( options, 'endIndex' ) ){

			if( ! _.isNull( options.startIndex ) && options.startIndex >= options.endIndex ){
				throw new Error('ERROR: startIndex must be lower than endIndex');
			}

			if( hasCollection ){
				if( ! _.isNull( options.startIndex ) && options.startIndex > (collection.length - 1) ){
					throw new Error('ERROR: startIndex out of range');
				}

				if( ! _.isNull( options.endIndex ) && options.endIndex > (collection.length - 1) ){
					throw new Error('ERROR: endIndex out of range');
				}
			}
		}

	}

}
