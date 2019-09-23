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

    it('should check if value is string', () =>{
        assert.isTrue( TypeUtil.isString( '' ) );
        assert.isTrue( TypeUtil.isString( 'lol' ) );
        assert.isTrue( TypeUtil.isString( '0' ) );
        assert.isTrue( TypeUtil.isString( 'false' ) );
        assert.isTrue( TypeUtil.isString( ' ' ) );
        assert.isTrue( TypeUtil.isString( String('100') ) );

        assert.isFalse( TypeUtil.isString( undefined ) );
        assert.isFalse( TypeUtil.isString( true ) );
        assert.isFalse( TypeUtil.isString( false ) );
        assert.isFalse( TypeUtil.isString( NaN ) );
        assert.isFalse( TypeUtil.isString( null ) );
        assert.isFalse( TypeUtil.isString( [] ) );
        assert.isFalse( TypeUtil.isString( {} ) );
        assert.isFalse( TypeUtil.isString( () => {} ) );
    });

    it('should check if value is object', () =>{
        assert.isTrue( TypeUtil.isObject( {} ) );

        assert.isFalse( TypeUtil.isObject( '' ) );
        assert.isFalse( TypeUtil.isObject( 'a' ) );
        assert.isFalse( TypeUtil.isObject( 123 ) );
        assert.isFalse( TypeUtil.isObject( [] ) ); 
        assert.isFalse( TypeUtil.isObject( undefined ) );
        assert.isFalse( TypeUtil.isObject( true ) );
        assert.isFalse( TypeUtil.isObject( false ) );
        assert.isFalse( TypeUtil.isObject( NaN ) );
        assert.isFalse( TypeUtil.isObject( null ) );
        assert.isFalse( TypeUtil.isObject( () => {} ) );
    }); 
    
    it('should check if value is boolean', () =>{
        assert.isTrue( TypeUtil.isBoolean( true ) );
        assert.isTrue( TypeUtil.isBoolean( false ) );

        assert.isFalse( TypeUtil.isBoolean( '' ) );
        assert.isFalse( TypeUtil.isBoolean( 'a' ) );
        assert.isFalse( TypeUtil.isBoolean( 123 ) );
        assert.isFalse( TypeUtil.isBoolean( [] ) ); 
        assert.isFalse( TypeUtil.isBoolean( undefined ) );
        assert.isFalse( TypeUtil.isBoolean( NaN ) );
        assert.isFalse( TypeUtil.isBoolean( null ) );
        assert.isFalse( TypeUtil.isBoolean( {} ) );
        assert.isFalse( TypeUtil.isBoolean( () => {} ) );
    });      

});
