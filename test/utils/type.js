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
    
});
