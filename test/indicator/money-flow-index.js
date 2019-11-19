'use strict';

const assert = require('chai').assert;
const MFI = require('./../../lib/indicator/money-flow-index');

describe('Money Flow Index', () => {

	let data = [
        //High,, Low, Close, Volume
        [24.64,   24.62,   24.63,       18730    ], 
        [24.70,   24.68,   24.69,       12272    ],
        [25.00,   24.98,   24.99,       24691    ],
        [25.37,   25.35,   25.36,       18358    ],
        [25.20,   25.18,   25.19,       22964    ],
        [25.18,   25.16,   25.17,       15919    ],
        [25.02,   25.00,   25.01,       16067    ],
        [24.97,   24.95,   24.96,       16568    ],
        [25.09,   25.07,   25.08,       16019    ],
        [25.26,   25.24,   25.25,       9774     ],
        [25.22,   25.20,   25.21,       22573    ],
        [25.38,   25.36,   25.37,       12987    ],
        [25.62,   25.60,   25.61,       10907    ],
        [25.59,   25.57,   25.58,       5799     ],
        [25.47,   25.45,   25.46,       7395     ],
        [25.34,   25.32,   25.33,       5818     ],
        [25.10,   25.08,   25.09,       7165     ],
        [25.04,   25.02,   25.03,       5673     ],
        [24.92,   24.90,   24.91,       5625     ],
        [24.90,   24.88,   24.89,       5023     ],
	];

    let expectedResults = [
        //moneyFlowRatio, moneyFlowIndex
        [0.98,	49.47],
        [0.82,	45.11],
        [0.57,	36.27],
        [0.40,	28.41],
        [0.46,	31.53],
        [0.51,	33.87],
    ];

    let convertArrayToCollection = ( data ) => {
        return data.map( item => { 
            return {high: item[0], low: item[1], close: item[2], volume: item[3] };
        });
    };

	it('should calculate correctly and return result', () => {
        let expectedResultsCopy = [...expectedResults];

        for(let i=0, len=data.length-expectedResultsCopy.length; i<len; i++){
            expectedResultsCopy.unshift( [0,0] );
        }

        (async () => {
            let opts = { sliceOffset: false };
            let mfi = new MFI( opts );
            mfi.setValues( convertArrayToCollection( data ) );
            let results = await mfi.calculate();

            assert.isTrue( results.length == expectedResultsCopy.length );
            for( let i=0;i<results.length; i++){
               let {moneyFlowRatio, moneyFlowIndex } = results[ i ];   
               assert.closeTo( moneyFlowRatio, expectedResultsCopy[ i ][ 0 ], 0.02 );
               assert.closeTo( moneyFlowIndex, expectedResultsCopy[ i ][ 1 ], 0.1 );
            }
        })();  

    });

    it('should calculate correctly with options and return results', () => {
        let dataCopy = [...data];
        let values =  [0.64, 0.62, 0.63, 1000 ];
        dataCopy.unshift( values  );
        dataCopy.push( values );

        (async () => {
            let opts = { sliceOffset: true, startIndex: 1, endIndex: dataCopy.length - 2 };
            let mfi = new MFI( opts );
            mfi.setValues( convertArrayToCollection( dataCopy ) );
            let results = await mfi.calculate();

            assert.isTrue( results.length == expectedResults.length );
            for( let i=0;i<results.length; i++){
               let {moneyFlowRatio, moneyFlowIndex } = results[ i ];   
               assert.closeTo( moneyFlowRatio, expectedResults[ i ][ 0 ], 0.02 );
               assert.closeTo( moneyFlowIndex, expectedResults[ i ][ 1 ], 0.1 );
            }
        })(); 
    });

});