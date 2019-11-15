'use strict';

const assert = require('chai').assert;
const LWMA = require('./../../lib/indicator/linearly-weighted-moving-average');

describe('Lineary wighted moving average', () =>{

    let data = [10, 15, 16, 18, 20, 18, 17];
    let periods = 4;

    let expectedResults = [ 16, 17.85, 18.22, 18.12];

    let runTest = async ( options, data ) => {
        let lwma = new LWMA( options );
        lwma.setValues( data );
        return await lwma.calculate();
    };

    let assertResults = ( results, expectedResults ) => {
        assert.isArray( results );
        results.forEach( ( result, idx ) => {
            assert.isObject( result );
            assert.containsAllKeys( result, ['price', 'lwma'] );
            assert.isNumber( result.price );
            assert.isNumber( result.lwma );
            assert.closeTo( result.lwma, expectedResults[idx], 0.1 );
            assert.isTrue( result.price == data[ periods - 1 + idx ] );
        });
    };

    let assertResults_2 = ( results, expectedResults ) => {
        assert.isArray( results );
        results.forEach( ( result, idx ) => { 
            assert.isObject( result );
            assert.containsAllKeys( result, ['price', 'lwma'] );
            assert.isNumber( result.price ); 
            assert.isNumber( result.lwma ); 
            assert.closeTo( result.lwma, expectedResults[idx].lwma , 0.1 );
            assert.isTrue( result.price == expectedResults[idx].price );
        });
    };       

    it('should calculate correctly and return results', () => {
        (async () => {
            let opts = {periods: periods, lazyEvaluation: true, sliceOffset: true};
            let r = await runTest( opts, data );
            assertResults(r , expectedResults);
        })();
    });

    it('should calculate correctly with custom options and return results', () => {
        (async () => {
            let clonedData = [ ...data ];
            clonedData.unshift(5);
            clonedData.push(20);
            let opts = {periods: 4, sliceOffset: true, startIndex: 1, endIndex: clonedData.length - 2, lazyEvaluation: true};
            let r = await runTest( opts, clonedData )
            assertResults( r, expectedResults);
        })();
    });

    it('should calculate correctly and return results with included offset', () => {
        (async () => {
            let clonedExpectedResults = [ ...expectedResults ];
            let opts = {periods: periods, sliceOffset: false, lazyEvaluation: true};

            for(let i=0; i<opts.periods - 1; i++){
                clonedExpectedResults.unshift( 0 );
            }

            let expected = clonedExpectedResults.map( (val, idx ) => {
                return {
                    lwma: val,
                    price: data[ idx ],
                };
            });

            let r = await runTest( opts, data );
            assertResults_2( r, expected);
        })();
    });

});
