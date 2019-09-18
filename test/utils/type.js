'use strict';

const assert = require('chai').assert;
const TypeUtil = require('./../../lib/utils/type');

describe( 'Type util', () =>{

	it('should check if value is null', () =>{
        assert.isTrue( TypeUtil.isNull( null ) );

        assert.isFalse( TypeUtil.isNull( 0 ) );
        assert.isFalse( TypeUtil.isNull( undefined ) );
        assert.isFalse( TypeUtil.isNull( '' ) );
        assert.isFalse( TypeUtil.isNull( false ) );
        assert.isFalse( TypeUtil.isNull( NaN ) );
        assert.isFalse( TypeUtil.isNull( [] ) );
        assert.isFalse( TypeUtil.isNull( {} ) );
        assert.isFalse( TypeUtil.isNull( () => {} ) );
    });
    
    it('should check if value is number', () =>{
        assert.isTrue( TypeUtil.isNumber( 0 ) );
        assert.isTrue( TypeUtil.isNumber( 1 ) );
        assert.isTrue( TypeUtil.isNumber( -1 ) );
        assert.isTrue( TypeUtil.isNumber( 1.234 ) );
        assert.isTrue( TypeUtil.isNumber( 2e64 ) );

        assert.isFalse( TypeUtil.isNumber( undefined ) );
        assert.isFalse( TypeUtil.isNumber( '' ) );
        assert.isFalse( TypeUtil.isNumber( '0' ) );
        assert.isFalse( TypeUtil.isNumber( '1' ) );
        assert.isFalse( TypeUtil.isNumber( '-1' ) );
        assert.isFalse( TypeUtil.isNumber( true ) );
        assert.isFalse( TypeUtil.isNumber( false ) );
        assert.isFalse( TypeUtil.isNumber( NaN ) );
        assert.isFalse( TypeUtil.isNumber( null ) );
        assert.isFalse( TypeUtil.isNumber( [] ) );
        assert.isFalse( TypeUtil.isNumber( {} ) );
        assert.isFalse( TypeUtil.isNumber( () => {} ) );
    });
});
