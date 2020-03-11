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
        results.forEach( (item, idx) => {
            assert.containsAllKeys( item, ['price', 'wma'] );
            assert.closeTo( item.wma, expectedResults[ idx ], 0.02 );
            assert.isTrue( item.price > 0 ); 
        });
    };

    it('should calculate correctly and return results', () => {
        ( async () => {
            let expectedResults = [90.62, 90.57];
            await runTest( data, expectedResults, {periods: 5, sliceOffset: true} );
     
            let expectedResults2 = [0,0,0,0].concat(expectedResults);
            await runTest( data, expectedResults2, {periods: 5, sliceOffset: false} );
        })();
    });
        
});   