'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const WMA = require('./../../lib/indicator/weighted-moving-average');

describe('WMA', () => {

    let data = [90.91, 90.83, 90.28, 90.36, 90.90, 90.51];

    let runTest = async ( data, expectedResults, options = {} ) => {
        let wma = new WMA( options ); 
        wma.setValues( data );
        let results = await wma.calculate();
        assert.isArray( results );
        assert.isTrue( results.length == expectedResults.length );        
        results.forEach( (item, idx) => {
            assert.containsAllKeys( item, ['price', 'wma'] );
            assert.closeTo( item.wma, expectedResults[ idx ], 0.02 );
            assert.isTrue( item.price > 0 ); 
        });
    };

    let runTest_2 = async (opts, data, expectedResult) => {
        let sma = new WMA( opts );
        sma.setValues( data );
        let results = await sma.calculate();

        assert.isArray( results )
        assert.isTrue( expectedResult.length == results.length );
        results.forEach( (item, idx) => {
            assert.isObject( item );
            assert.containsAllKeys( item, ['price', 'wma'] );
            assert.isNumber( item.price );
            assert.isNumber( item.wma );
            assert.closeTo( expectedResult[idx].wma, item.wma, 0.1 );
            assert.isTrue( item.price == data[ opts.startIndex + opts.periods - 1 + idx ] );
        });
    }

    it('should calculate correctly and return results', ( done ) => {
        ( async () => {
            let expectedResults = [90.62, 90.57];
            await runTest( data, expectedResults, {periods: 5, sliceOffset: true} );
     
            let expectedResults2 = [0,0,0,0].concat(expectedResults);
            await runTest( data, expectedResults2, {periods: 5, sliceOffset: false} );

            done();
        })();
    });

    it('should calculate correctly with starIndex and endIndex options and return result', ( done ) => {
		(async function(){
            let opts = { periods: 2, startIndex: 1, endIndex: data.length - 2, lazyEvaluation: true, sliceOffset: true };

			let expectedResult =   [
                { price: 90.28, wma: 90.46 },
                { price: 90.36, wma: 90.33 },
                { price: 90.9, wma: 90.72 } 
            ];
            await runTest_2( opts, data, expectedResult );
            done();
        })();

    });
        
});   