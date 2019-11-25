'use strict';

const assert = require('chai').assert;
const SMMA = require('./../../lib/indicator/smoothed-moving-average');

describe('SMMA', () => {

    let data = [20, 21, 22, 21, 20, 19, 18, 22, 21, 22, 23, 24 ];

    let runTest = async ( data, expectedResults, options = {} ) => {
        let smma = new SMMA( options ); 
        smma.setValues( data );
        let results = await smma.calculate();

        assert.isArray( results );
        assert.isTrue( results.length == expectedResults.length );
        results.forEach( (item, idx) => {
            assert.containsAllKeys( item, ['price', 'smma'] );
            assert.closeTo( item.smma, expectedResults[ idx ], 0.02 );
            assert.isTrue( item.price > 0 ); 
        });
    };

    it('should calculate correctly and return results', () => {
        ( async () => {
            let expectedResults = [21, 20.75, 20.31, 19.73, 20.3, 20.48, 20.86, 21.4, 22.05];
            await runTest(  data, expectedResults, {periods: 4, sliceOffset: true } );

            let expectedResults2 = [0,0,0].concat(expectedResults);
            await runTest( data, expectedResults2, {periods: 4, sliceOffset: false } );

            let dataCopy = [...data];
            dataCopy.unshift( 19 );
            dataCopy.push( 22 );
            await runTest( dataCopy, expectedResults2, { periods: 4, sliceOffset: false, startIndex: 1, endIndex: dataCopy.length - 2 } );
        })();

    });

});
