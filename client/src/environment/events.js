"use strict";
var Events = {
    add     : (function () {
        if (typeof window.addEventListener === "function") {
            return function (element, eventName, handle) {
                var events = (eventName instanceof Array ? eventName : [eventName]);
                Array.prototype.forEach.call(
                    events,
                    function (event) {
                        element.addEventListener(event, handle, false);
                    }
                );
            };
        } else if (typeof document.attachEvent === "function") {
            return function (element, eventName, handle) {
                var events = (eventName instanceof Array ? eventName : [eventName]);
                Array.prototype.forEach.call(
                    events,
                    function (event) {
                        element.attachEvent(("on" + event), handle);
                    }
                );
            };
        } else {
            return function (element, eventName, handle) {
                var events = (eventName instanceof Array ? eventName : [eventName]);
                Array.prototype.forEach.call(
                    events,
                    function (event) {
                        element[("on" + event)] = handle;
                    }
                );
            };
        };
    }()),
    remove  : (function () {
        if (typeof window.removeEventListener === "function") {
            return function (element, eventName, handle) {
                element.removeEventListener(eventName, handle, false);
            };
        } else if (typeof document.detachEvent === "function") {
            return function (element, eventName, handle) {
                element.detachEvent(("on" + eventName), handle);
            };
        } else {
            return function (element, eventName, handle) {
                element[("on" + eventName)] = null;
            };
        };
    }())
};

//Attach to environment
(function () {
    let Environment = require('./environment.js');
    //_node
    Environment.define.node('events.add', function (type, handle) {
        return Events.add(this.target, type, handle);
    });
    Environment.define.node('events.remove', function (type, handle) {
        return Events.remove(this.target, type, handle);
    });
    //_nodes
    Environment.define.nodes('events.add', function (type, handle) {
        Array.prototype.forEach.call(this.target, function (target) {
            Events.add(target, type, handle);
        });
    });
    Environment.define.nodes('events.remove', function (type, handle) {
        Array.prototype.forEach.call(this.target, function (target) {
            Events.remove(target, type, handle);
        });
    });
} ());

module.exports = Events;