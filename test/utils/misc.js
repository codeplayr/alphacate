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
    
    it('should extends objects', () => {
        let obj_1 = {a: 'a', b: 'b'};
        let obj_2 = {b: 2, c: 'c'};
        let result = Misc.extends( obj_1, obj_2 );

        assert.isObject( result );
        assert.containsAllKeys( result, ['a', 'b', 'c'] );
        assert.isTrue( result.a === obj_1.a );
        assert.isTrue( result.b === obj_2.b );
        assert.isTrue( result.c === obj_1.c );
    });

});
