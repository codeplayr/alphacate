'use strict';

module.exports = {
	isNumeric (num){
		if(num === null && typeof num === "object") return false;
		return !isNaN(num);
	},
	roundTo (num, places) {
  		return +(Math.round(num + "e+" + places)  + "e-" + places);
	},
}
