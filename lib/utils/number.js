'use strict';

const bankersRounding = require('bankers-rounding');

module.exports = {
	isNumeric (num){
		if(num === null && typeof num === "object") return false;
		return !isNaN(num);
	},
	roundTo (num, places, type='bankers') {
		if( type == 'bankers' ){
			return bankersRounding( num, places );
		}
  		return +(Math.round(num + "e+" + places)  + "e-" + places);
	},
}
