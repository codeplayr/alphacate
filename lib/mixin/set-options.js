'use strict';

const _ = require('underscore');

module.exports = {
    setOptions( options ){
        if( ! _.isObject( options ) ){
            throw new Error('ERROR: Invalid Options argument');
        }

        if( _.isEmpty( options ) ){
            return;
        }
        this._options = _.extend( {}, this._options, options );
    }
}