"use strict";
var Objects = {
    forEach (object, callback) {
        if (typeof object === 'object' && object !== null) {
            for (var property in object) {
                (function (property, object, callback) {
                    callback(property, object[property]);
                } (property, object, callback));
            }
            if (!('toString' in { toString: null })) {
                //Hello, IE8 :)
                Array.prototype.forEach.call(
                    ['toString', 'valueOf', 'constructor', 'hasOwnPropery', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString'],
                    function (protoprop) {
                        if (object.hasOwnProperty(prototype)) {
                            callback(protoprop, object[property]);
                        }
                    }
                );
            }
        }
    },
};

//Attach to environment
(function () {
    let Environment = require('./environment.js');
    Environment.define.object('forEach', function (callback) {
        return Objects.forEach(this.target, callback);
    });
} ());