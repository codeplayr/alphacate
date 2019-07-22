'use strict';

module.exports = {
	isNumeric: function(num){
		return !isNaN(num);
	},
	roundTo: function(num, places) {
  		return +(Math.round(num + "e+" + places)  + "e-" + places);
	},
}
