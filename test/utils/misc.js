'use strict';

const assert = require('chai').assert;
const Misc = require('./../../lib/utils/misc');

describe( 'Misc Utils', () =>{

    it('should check if object has propety', () => {
        assert.isTrue( Misc.has( {foo: 'bar'}, 'foo' ) );
        assert.isTrue( Misc.has( {'foo': 'bar'}, 'foo' ) );
        assert.isTrue( Misc.has( {foo: null}, 'foo' ) );
        assert.isFalse( Misc.has( {foo: 'bar'}, 'bar' ) );
        assert.isFalse( Misc.has( 123, 'bar' ) );
        assert.isFalse( Misc.has( '123', 'bar' ) );
    });

});
