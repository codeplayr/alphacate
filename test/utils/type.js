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

    it('should check if value is undefined', () =>{
        let a;
        assert.isTrue( TypeUtil.isUndefined( a ) );
        assert.isTrue( TypeUtil.isUndefined( undefined ) );

        assert.isFalse( TypeUtil.isUndefined( true ) );
        assert.isFalse( TypeUtil.isUndefined( false ) );
        assert.isFalse( TypeUtil.isUndefined( '' ) );
        assert.isFalse( TypeUtil.isUndefined( 'a' ) );
        assert.isFalse( TypeUtil.isUndefined( 123 ) );
        assert.isFalse( TypeUtil.isUndefined( [] ) ); 
        assert.isFalse( TypeUtil.isUndefined( NaN ) );
        assert.isFalse( TypeUtil.isUndefined( null ) );
        assert.isFalse( TypeUtil.isUndefined( {} ) );
        assert.isFalse( TypeUtil.isUndefined( () => {} ) );
    });  

    it('should check if value is NaN', () =>{
        assert.isTrue( TypeUtil.isNaN( NaN ) );

        assert.isFalse( TypeUtil.isNaN( undefined ) );
        assert.isFalse( TypeUtil.isNaN( true ) );
        assert.isFalse( TypeUtil.isNaN( false ) );
        assert.isFalse( TypeUtil.isNaN( '' ) );
        assert.isFalse( TypeUtil.isNaN( 'a' ) );
        assert.isFalse( TypeUtil.isNaN( 123 ) );
        assert.isFalse( TypeUtil.isNaN( [] ) ); 
        assert.isFalse( TypeUtil.isNaN( {} ) );
        assert.isFalse( TypeUtil.isNaN( null ) );
        assert.isFalse( TypeUtil.isNaN( () => {} ) );
    });  
    
    it('should check if value is function', () =>{
        let a = () => {};
        assert.isTrue( TypeUtil.isFunction( a ) );

        assert.isFalse( TypeUtil.isFunction( undefined ) );
        assert.isFalse( TypeUtil.isFunction( true ) );
        assert.isFalse( TypeUtil.isFunction( false ) );
        assert.isFalse( TypeUtil.isFunction( '' ) );
        assert.isFalse( TypeUtil.isFunction( 'a' ) );
        assert.isFalse( TypeUtil.isFunction( 123 ) );
        assert.isFalse( TypeUtil.isFunction( [] ) ); 
        assert.isFalse( TypeUtil.isFunction( {} ) );
        assert.isFalse( TypeUtil.isFunction( null ) );
    });  
    
});
