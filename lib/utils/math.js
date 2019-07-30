'use strict';

module.exports = {

	max ( values ){
		return Math.max.apply(null, values);
	},

	min ( values ){
		return Math.min.apply(null, values );
	},

	range ( values ){
		return this.max( values ) - this.min( values );
	},

	midrange ( values ){
		return this.range( values ) / 3;
	},

	sum ( values ) {
		let num = 0;
		let len = values.length;
		for( let i = 0; i < len; i++ )num += values[i];
		return num;
	},

	mean ( values ){
		return (this.sum( values ) / values.length);
	},

	meanDeviation ( values ){
		let mean = this.mean( values );
		let distance = [];
		values.forEach( ( val ) => distance.push( Math.abs( val - mean ) ) );
		return this.mean( distance );
	},

	average ( values){
		return this.mean( values );
	},

	median ( values, doSortItems = true ){
		if( doSortItems )values.sort( ( a,b ) => a - b );
		let mid = values.length / 2;
		return mid % 1 ? values[ mid - 0.5 ] : ( values[ mid -1 ] + values[ mid ] ) / 2;
	},

}
