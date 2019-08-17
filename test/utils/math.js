'use strict';

const assert = require('chai').assert;
const MathUtil = require('./../../lib/utils/math');

describe( 'Math', () =>{

	it('should calculate sum', () =>{
		assert.isTrue( MathUtil.sum([1,2,3,4]) == 10 );
	});


	it('should calculate average', () => {
		assert.isTrue( MathUtil.average([1,2,3,4]) == 2.5 );
	});


	it('should calculate median', () =>{
		assert.isTrue( MathUtil.median( [1,1,2,3,16,1,2] ) == 2 );
		assert.isTrue( MathUtil.median( [1,1,2,2,3,3,3,16]) == 2.5 );
	});

	it('should calculate variance', () => {
		let items_1 = [1, 2, 3, 4, 5];
		let items_2 = [1, 2, 3, 4, 5, 1];

		//Sample Mode
		assert.isTrue( MathUtil.variance( items_1 ) == 2.5);
		assert.isTrue( MathUtil.variance( items_2 ).toFixed(2) == 2.67);

		//Population Mode
		assert.isTrue( MathUtil.variance( items_1, 'population' ) == 2);
		assert.isTrue( MathUtil.variance( items_2, 'population' ).toFixed(2) == 2.22);
	});

	it('should calculate standard deviation', () => {
		let items_1 = [1, 2, 3, 4, 5];
		let items_2 = [1, 2, 3, 4, 5, 1];

		//Sample Mode
		assert.isTrue( MathUtil.standardDeviation( items_1 ).toFixed(2) == 1.58 );
		assert.isTrue( MathUtil.standardDeviation( items_2 ).toFixed(2) == 1.63 );

		//Population Mode
		assert.isTrue( MathUtil.standardDeviation( items_1, 'population' ).toFixed(2) == 1.41 );
		assert.isTrue( MathUtil.standardDeviation( items_2, 'population' ).toFixed(2) == 1.49 );
	});
	
	it('should calculate the mean deviation', () => {
		let items = [3, 6, 6, 7, 8, 11, 15, 16];
		assert.isTrue( MathUtil.meanDeviation( items ) == 3.75 );
	});
	
});
