'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const OBV = require('./../../lib/indicator/on-balance-volume');

describe('On Balance Volume', function(){

	let data = [
		[ 10, 25200 ],
		[ 10.15, 30000 ],
		[ 10.17, 25600],
		[ 10.13, 32000],
		[ 10.11, 23000],
		[ 10.15, 40000],
		[ 10.20, 36000],
		[ 10.20, 20500],
		[ 10.22, 23000],
		[ 10.21, 27500],
	];

	it('should calculate correctly and return result', () => {

		( async () => {
			let obv = new OBV( {lazyEvaluation: true} );
			let collection = data.map( (item) => {
				return { price: item[0], volume: item[1] };
			});

			obv.setValues( collection );
			let result = await obv.calculate();

			let exptedResult = [
				0,
				30000,
				55600,
				23600,
				600,
				40600,
				76600,
				76600,
				99600,
				72100,
			];

			assert.isArray( result );
			assert.isTrue( data.length == exptedResult.length );

			for(let i=0; i<exptedResult.length; i++){
				let idx = i;
				let expectedValue = exptedResult[ idx ];
				assert.isObject( result[idx] );
				assert.containsAllKeys( result[idx], ['price', 'obv'] );
				assert.isTrue( result[idx].price == data[idx][0] );
				assert.closeTo( result[idx].obv, expectedValue, 100 );
			};

		})();

	});
	
	it('should calculate correctly within range and return result', () => {
		( async () => {
			let opts = {startIndex: 2, endIndex: data.length - 2, lazyEvaluation: true};
			let obv = new OBV( opts );

			let collection = data.map( (item) => {
				return { price: item[0], volume: item[1] };
			});

			obv.setValues( collection );
			let result = await obv.calculate();

			let exptedResult = [
				0,
				-32000,
				-55000,
				-15000,
				21000,
				21000,
				44000,
			];

			assert.isArray( result );
			assert.isTrue( result.length == exptedResult.length );
			exptedResult.forEach( (expectedValue, idx) => {
				assert.closeTo( result[idx].obv, expectedValue, 100 );
			});
		})();
	});

	it('should throw error on invalid options', () => {
		let runTest = async ( opts ) => {
			let obv = new OBV( opts );

			let collection = data.map( (item) => {
				return { price: item[0], volume: item[1] };
			});

			let failed = false;
			try{
				obv.setValues( collection );
				let r = await obv.calculate();
			}
			catch( err ){
				if( err.name == 'Error' ){
					failed = true;
				}
			}
			assert.isTrue( failed );
		};

		let arr = [
			{ startIndex: data.length + 1, lazyEvaluation: true },
			{ endIndex: data.length + 1, lazyEvaluation: true },
			{ startIndex: data.length, endIndex: 0, lazyEvaluation: true },
		];

		for( let i=0; i<arr.length; i++ ){
			runTest( arr[i ] );
		}
	});

	it('should throw error on invalid values', () => {
		assert.throws( () => (new OBV()).setValues( [{'price': 1, 'foo': 10}] ), Error );
		assert.throws( () => (new OBV()).setValues( [{'volume': 1, 'foo': 10}] ), Error );
	});
	
});
