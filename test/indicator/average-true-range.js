'use strict';

const assert = require('chai').assert;
const ATR = require('./../../lib/indicator/average-true-range');
const Fixture = require('./../fixtures/average-true-range');

describe('Average True Range', () => {

    const data = Fixture.data;
    const expectedResults = Fixture.dataResults;

    it('should calculate true range correctly and return result', () => {
        let atr = new ATR( {lazyEvaluation: false} );
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

     it('should compute correctly and return results', () => {
        let runTest = async ( options, collection, expectedResults ) => {
            let atr = new ATR( options );
            atr.setValues( collection );
            let results = await atr.calculate();

            assert.isArray(results);
            assert.isTrue( results.length == expectedResults.length );

            results.forEach( ( item, idx ) => {
                assert.isObject( item );
                assert.closeTo( expectedResults[ idx ][ 3 ], item.tr, 0.02 );
                assert.closeTo( expectedResults[ idx ][ 4 ], item.atr, 0.02 );
            });
        };

        let collection =  [];
        data.forEach( (item, idx) => {
            collection.push( {high: item[0], low: item[1], close: item[2] } );
        });

        runTest( {periods: 14}, collection, expectedResults );
    });

    it('should throw error on invalid values', () => {
		assert.throws( () => ATR(), Error );
		assert.throws( () => (new ATR()).setValues(1), Error );
        assert.throws( () => (new ATR()).setValues('foo'), Error );

        let atr = new ATR();
        atr.setValues( [ {'foo': 100} ] );
        assert.throws( () => atr.calculate(), Error );
	});

    it('should throw error on invalid values when in async', ( done ) => {
        let runTest = async () => {
            try{
                let atr =  new ATR( {lazyEvaluation: true} );
                let r = await atr.calculate();
            }
            catch( err ){
                return false;
            }
            return true;
        }

        (async () => {
            let b = await runTest();
            assert.isFalse( b );
            done();
        })();
    })

	it('should throw error on invalid options', () => {
		function runTest( opts ){
			opts = Object.assign( {}, opts, {lazyEvaluation: false} );
			let atr = new ATR( opts);
			atr.setValues( data );
			assert.throws( () => atr.calculate(), Error );
		};

		[
			{ periods: data.length + 1 },
			{ startIndex: data.length + 1 },
			{ startIndex: 1, periods: data.length },
			{ endIndex: data.length + 1 },
			{ periods: 'foo' },
			{ startIndex: data.length, endIndex: 0 },
			{ startIndex: 1, periods: 10 },
			{ startIndex: 1, endIndex: 2 },
		].forEach( ( item ) => runTest( item )  );

	});
});
