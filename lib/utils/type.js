'use strict';

module.exports = {
	isNull(value){
		return (value === null && typeof value === "object");
	},

	isNumber(value){
		return Number.isFinite(value);
	},

	isString(value){
    	return (Object.prototype.toString.call(value) == '[object String]');
	},

	isObject(obj){
    	return !this.isArray(obj) && (typeof obj === 'object' && !!obj);
  	},

	isBoolean(obj) {
    	return (obj === true || obj === false || toString.call(obj) === '[object Boolean]');
  	},

	isUndefined(obj){
      return (obj === void 0);
  	},

	isNaN(obj){
    	return Number.isNaN(obj);
  	},

	isArray( obj ){
		return Array.isArray( obj );
	},

	isFunction(obj){
		return typeof obj == 'function' || false;
  	},
}
