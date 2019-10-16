'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const ROC = require('./../../lib/indicator/rate-of-change');

describe('Rate Of Change', () => {

    let data = [ 2,3,5,8,4,2,6,7 ];
    let expectedResults = [0, 0, 0, 0, 100, -33.3, 20, -12.5 ];

    let runTest = async ( data, expectedResults, options ) => {
        let roc = new ROC( options );
        roc.setValues( data );
        let results = await roc.calculate();

        assert.isArray( results );
        assert.isTrue( results.length == expectedResults.length );  
        results.forEach( ( result, idx ) => {
            assert.containsAllKeys( result, ['price', 'roc'] );
            assert.isNumber( result.price );
            assert.isNumber( result.roc );
            assert.closeTo( result.roc, expectedResults[idx], 0.1 );
        });
    };

    it('should calculate correctly and return results', () => {
        (async () => {
            runTest( data, expectedResults, {periods: 4, sliceOffset: false} );
        })();
    });

});