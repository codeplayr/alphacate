'use strict';

const assert = require('chai').assert;
const _ = require('underscore');
const ADL = require('./../../lib/indicator/accumulation-distribution-line');

describe('Accumulation Distribution Line', () => {

    let data = [
        //high, low, close, volume
		[62.34,	61.37,	62.15,	7849   ],
		[62.05,	60.69,	60.81,	11692  ],
		[62.27,	60.10,	60.45,	10575  ],
		[60.79,	58.61,	59.18,	13059  ],
		[59.93,	58.71,	59.24,	21034  ],
		[61.75,	59.86,	60.20,	29630  ],
		[60.00,	57.97,	58.48,	17705  ],
		[59.00,	58.02,	58.24,	7259   ],
		[59.07,	57.48,	58.69,	10475  ],
		[59.22,	58.30,	58.65,	5204   ],
		[58.75,	57.83,	58.47,	3423   ],
		[58.65,	57.86,	58.02,	3962   ],
		[58.47,	57.91,	58.17,	4096   ],
		[58.25,	57.83,	58.07,	3766   ],
		[58.35,	57.53,	58.13,	4239   ],
		[59.86,	58.58,	58.94,	8040   ],
		[59.53,	58.30,	59.10,	6957   ],
		[62.10,	58.53,	61.92,	18172  ],
		[62.16,	59.80,	61.37,	22226  ],
		[62.67,	60.93,	61.68,	14614  ],
		[62.38,	60.15,	62.09,	12320  ],
		[63.73,	62.26,	62.89,	15008  ],
		[63.85,	63.00,	63.53,	8880   ],
		[66.15,	63.58,	64.01,	22694  ],
		[65.34,	64.07,	64.77,	10192  ],
		[66.48,	65.20,	65.22,	10074  ],
		[65.23,	63.21,	63.28,	9412   ],
	];
	
    let expectedResults = [
        4774,
        -4855,
        -12019,
        -18249,
        -21006,
        -39976,
        -48785,
        -52785,
        -47317,
        -48561,
        -47216,
        -49574,
        -49866,
        -49354,
        -47389,
        -50907,
        -48813,
        -32474,
        -25128,
        -27144,
        -18028,
        -20193,
        -18000,
        -33099,
        -32056,
        -41816,
        -50575,
    ];
    
    let runTest = async ( data, expectedResults, options = {} ) => {
        let adl = new ADL( options );
        adl.setValues( data );
        let results = await adl.calculate();

        assert.isArray( results );
        assert.isTrue( results.length == expectedResults.length );

        results.forEach( (resultItem, idx) => {
            assert.closeTo( resultItem.adl, expectedResults[ idx ], 50  );
        });
	};
	
    let convertArrayToCollection = ( data ) => {
        return data.map( item => { 
            return {high: item[0], low: item[1], close: item[2], volume: item[3] };
        });
    };

    it('should calculate correctly and return result', () => {
        let d = convertArrayToCollection( data );   
        (async () =>{
            await runTest( d, expectedResults );
        })();
    });
});