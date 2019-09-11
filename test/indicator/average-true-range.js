'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const ATR = require('./../../lib/indicator/average-true-range');
const Fixture = require('./../fixtures/average-true-range');

describe('Average True Range', function(){

    const data = Fixture.data;
    const expectedResults = Fixture.dataResults;

    it('should calculate true range correctly and return result', () => {
        let atr = new ATR();
        function runTest( currentItem, prevItem, expectedResult ){
           let result =  atr._getTrueRange( currentItem, prevItem );

            assert.isNumber( result );
            assert.closeTo( result, expectedResult, 0.05 );
        };

        for(let i=0; i<5; i++ ){
            let currItem = data[ i ];
            currItem = { high: currItem[0], low: currItem[1], close: currItem[2] };

            let prevItem =  (i ) ? data[ i - 1 ] : null;
            if(prevItem){
                prevItem = { high: prevItem[0], low: prevItem[1], close: prevItem[2] };
            }
            let expectedResult = expectedResults[i][3];

            runTest( currItem, prevItem, expectedResult );
        };

    });

	it('should calculate the first average true range in collection correctly and return result', () => {
		let collection = [];
		for(let i=0; i<14;i++ ){
			collection.push( {tr: expectedResults[i][3] } );
		}

		let atr = new ATR();
		let result = atr._calcFirstATR( collection );

		assert.isNumber( result );
		assert.closeTo( result, expectedResults[ 13 ][ 4 ], 0.01 );

	});

	it('should calculate remaining average true range correctly and return results', () => {
		let prevATR = expectedResults[ 13 ][ 4 ];
		let currTR = expectedResults[ 14 ][ 3 ];
		let atr = new ATR();
		let result = atr._calcRemainingATR( prevATR, currTR, 14 );

		assert.isNumber( result );
		assert.closeTo(result, expectedResults[ 14 ][ 4 ], 0.02 );
	});
	
});
