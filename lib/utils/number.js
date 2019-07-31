'use strict';

module.exports = {
	isNumeric (num){
		return !isNaN(num);
	},
	roundTo (num, places) {
  		return +(Math.round(num + "e+" + places)  + "e-" + places);
	},
}
