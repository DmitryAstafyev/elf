/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Environment = __webpack_require__(1),
	    events = __webpack_require__(2),
	    eventcaller = __webpack_require__(3),
	    objects = __webpack_require__(4),
	    binding = __webpack_require__(5),
	    unique = __webpack_require__(6),
	    Templates = __webpack_require__(7),
	    Dialogs = __webpack_require__(8),
	    Progress = __webpack_require__(9),
	    TextFileReader = __webpack_require__(10),
	    JSONRender = __webpack_require__(11),
	    Processes = __webpack_require__(12),
	    Ajax = __webpack_require__(13);
	
	events.add(window, 'load', function () {
	    function getResource() {
	        var fileloaderinput = 'fileloaderinput',
	            dialog_id = null;
	        dialog_id = Dialogs.show({
	            title: 'Welcome',
	            content: 'To start you should select a source-file or you can use default source.<input id="' + fileloaderinput + '" type="file"/>',
	            buttons: [{
	                caption: 'Get from my harddrive', callback: function callback() {
	                    _node('*[id="' + fileloaderinput + '"]').events().add('change', function (event) {
	                        if (event.target !== void 0 && event.target.files !== void 0 && event.target.files.length === 1) {
	                            if (event.target.files[0].name !== '') {
	                                var ext = event.target.files[0].name.match(/\w*$/i);
	                                ext = ext instanceof Array ? ext.length === 1 ? ext[0].toLowerCase() : null : null;
	                                if (ext === 'json') {
	                                    (function () {
	                                        var testFileLoader = new TextFileReader(event.target.files[0]),
	                                            progress_id = Progress.show({ caption: 'load file...' });
	                                        testFileLoader.load(function (result, error) {
	                                            Progress.close(progress_id);
	                                            if (typeof result !== 'undefined') {
	                                                progress_id = Progress.show({ caption: 'parsing file...' });
	                                                try {
	                                                    data = JSON.parse(result);
	                                                } catch (e) {} finally {
	                                                    Progress.close(progress_id);
	                                                    renderWays();
	                                                }
	                                            }
	                                        });
	                                    })();
	                                }
	                            }
	                        }
	                        return event;
	                    });
	                    _node('*[id="' + fileloaderinput + '"]').events().emulate('click');
	                }
	            }, {
	                caption: 'Use default data-source', callback: function callback() {
	                    var request = Ajax('./data/elf.json', 'GET', null, {
	                        success: function success(result) {
	                            data = result.parsed;
	                            renderWays();
	                        }
	                    });
	                    request.send();
	                }
	            }]
	        });
	    };
	    function renderWays() {
	        Dialogs.show({
	            title: 'How to render',
	            content: 'Cool! We have some data. How do you want render it?',
	            buttons: [{
	                caption: 'Show me structure of memory', callback: function callback() {
	                    window['__data'] = data;
	                    var processes = new Processes(data),
	                        progress_id = Progress.show({ caption: 'rendering object...' });
	                    processes.render({
	                        callback: function callback() {
	                            Progress.close(progress_id);
	                        }
	                    });
	                },
	                close: true
	            }, {
	                caption: 'Just show me JSON object', callback: function callback() {
	                    var JSONrender = new JSONRender(),
	                        progress_id = Progress.show({ caption: 'rendering object...' });
	                    JSONrender.render({
	                        data: data,
	                        callback: function callback() {
	                            Progress.close(progress_id);
	                        }
	                    });
	                }
	            }]
	        });
	    };
	    var data = null;
	    getResource();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var wrappers = null;
	//Wrapper to give comfortable access to DOM and other stuff
	wrappers = {
	    callers: {
	        node: function () {
	            var cache = {};
	            return function (selector, use_cache, document_link) {
	                var node = null,
	                    use_cache = typeof use_cache === 'boolean' ? use_cache : false;
	                if (typeof selector === 'string') {
	                    if (use_cache) {
	                        if (cache[selector]) {
	                            if (cache[selector] !== null) {
	                                node = cache[selector];
	                            }
	                        }
	                    }
	                    node = node !== null ? node : (document_link || document).querySelector(selector);
	                    if (use_cache && !cache[selector] && node !== null) {
	                        cache[selector] = node;
	                    }
	                    return new wrappers.constructors.node(node);
	                } else {
	                    if (selector !== void 0) {
	                        if (typeof selector.nodeName === 'string' || selector == window) {
	                            return new wrappers.constructors.node(selector);
	                        }
	                    }
	                }
	                return null;
	            };
	        }(),
	        nodes: function () {
	            var cache = {};
	            return function (selector, use_cache, document_link) {
	                var nodes = null,
	                    use_cache = typeof use_cache === 'boolean' ? use_cache : false;
	                if (typeof selector === 'string') {
	                    if (use_cache) {
	                        if (cache[selector]) {
	                            if (cache[selector] !== null) {
	                                if (cache[selector].length > 0) {
	                                    nodes = cache[selector];
	                                }
	                            }
	                        }
	                    }
	                    nodes = nodes !== null ? nodes : (document_link || document).querySelectorAll(selector);
	                    if (use_cache && !cache[selector] && nodes !== null) {
	                        if (nodes.length > 0) {
	                            cache[selector] = nodes;
	                        }
	                    }
	                    return new wrappers.constructors.nodes(nodes);
	                } else {
	                    if (selector !== void 0) {
	                        if (typeof selector.length === 'number') {
	                            if (selector.length > 0) {
	                                if (typeof selector[0] === 'string') {
	                                    nodes = [];
	                                    Array.prototype.forEach.call(selector, function (selector, index) {
	                                        var node = (document_link || document).querySelector(selector);
	                                        if (node !== null) {
	                                            nodes.push(node);
	                                        }
	                                    });
	                                    return new wrappers.constructors.nodes(nodes);
	                                } else if (typeof selector[0].nodeName === 'string') {
	                                    return new wrappers.constructors.nodes(selector);
	                                }
	                            }
	                        }
	                    }
	                }
	                return null;
	            };
	        }(),
	        array: function array(_array) {
	            if (_array instanceof Array) {
	                return new wrappers.constructors.array(_array);
	            } else {
	                return null;
	            }
	        },
	        object: function object(_object) {
	            if ((typeof _object === 'undefined' ? 'undefined' : _typeof(_object)) === 'object') {
	                return new wrappers.constructors.object(_object);
	            } else {
	                return null;
	            }
	        }
	    },
	    prototypes: {
	        node: {},
	        nodes: {},
	        array: {},
	        object: {},
	        update: {
	            update: function update(target) {
	                function update(obj) {
	                    var _updated = null;
	                    for (var pro in obj) {
	                        if (obj.hasOwnProperty(pro)) {
	                            if (_typeof(obj[pro]) === 'object' && pro !== 'target') {
	                                _updated = function updated() {
	                                    _updated.target = this.target;return _updated;
	                                };
	                                for (var subpro in obj[pro]) {
	                                    _updated[subpro] = obj[pro][subpro];
	                                }
	                                obj[pro] = _updated;
	                            } else if (typeof obj[pro] === 'function') {
	                                update(obj[pro]);
	                            }
	                        }
	                    }
	                };
	                if (wrappers.prototypes[target]) {
	                    update(wrappers.prototypes[target]);
	                }
	            },
	            node: function node() {
	                wrappers.prototypes.update.update('node');
	            },
	            nodes: function nodes() {
	                wrappers.prototypes.update.update('nodes');
	            },
	            array: function array() {
	                wrappers.prototypes.update.update('array');
	            },
	            object: function object() {
	                wrappers.prototypes.update.update('object');
	            }
	        },
	        add: {
	            add: function add(target, path, value) {
	                var steps = null,
	                    proto = null;
	                if (typeof target === 'string' && typeof path === 'string' && value !== void 0) {
	                    if (wrappers.prototypes[target]) {
	                        steps = path.split('.');
	                        proto = wrappers.prototypes[target];
	                        steps.forEach(function (property, index) {
	                            if (proto[property] === void 0) {
	                                if (index === steps.length - 1) {
	                                    proto[property] = value;
	                                } else {
	                                    proto[property] = {};
	                                    proto = proto[property];
	                                }
	                            } else if (_typeof(proto[property]) === 'object' || typeof proto[property] === 'function') {
	                                proto = proto[property];
	                            } else {
	                                proto[property] = {};
	                                proto = proto[property];
	                            }
	                        });
	                        wrappers.prototypes.update[target]();
	                    }
	                }
	            },
	            node: function node(path, value) {
	                wrappers.prototypes.add.add('node', path, value);
	            },
	            nodes: function nodes(path, value) {
	                wrappers.prototypes.add.add('nodes', path, value);
	            },
	            array: function array(path, value) {
	                wrappers.prototypes.add.add('array', path, value);
	            },
	            object: function object(path, value) {
	                wrappers.prototypes.add.add('object', path, value);
	            }
	        }
	    },
	    constructors: {
	        node: function node(_node) {
	            this.target = _node;
	        },
	        nodes: function nodes(_nodes) {
	            this.target = _nodes;
	        },
	        array: function array(_array2) {
	            this.target = _array2;
	        },
	        object: function object(_object2) {
	            this.target = _object2;
	        }
	    },
	    build: function build() {
	        for (var constructor in wrappers.constructors) {
	            wrappers.constructors[constructor].prototype = wrappers.prototypes[constructor];
	        }
	        return true;
	    }
	};
	//Build wrappers
	wrappers.build();
	//Define short callers
	window['_node'] = wrappers.callers.node;
	window['_nodes'] = wrappers.callers.nodes;
	window['_array'] = wrappers.callers.array;
	window['_object'] = wrappers.callers.object;
	
	module.exports = {
	    define: {
	        node: wrappers.prototypes.add.node,
	        nodes: wrappers.prototypes.add.nodes,
	        array: wrappers.prototypes.add.array,
	        object: wrappers.prototypes.add.object
	    }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Events = {
	    add: function () {
	        if (typeof window.addEventListener === "function") {
	            return function (element, eventName, handle) {
	                var events = eventName instanceof Array ? eventName : [eventName];
	                Array.prototype.forEach.call(events, function (event) {
	                    element.addEventListener(event, handle, false);
	                });
	            };
	        } else if (typeof document.attachEvent === "function") {
	            return function (element, eventName, handle) {
	                var events = eventName instanceof Array ? eventName : [eventName];
	                Array.prototype.forEach.call(events, function (event) {
	                    element.attachEvent("on" + event, handle);
	                });
	            };
	        } else {
	            return function (element, eventName, handle) {
	                var events = eventName instanceof Array ? eventName : [eventName];
	                Array.prototype.forEach.call(events, function (event) {
	                    element["on" + event] = handle;
	                });
	            };
	        };
	    }(),
	    remove: function () {
	        if (typeof window.removeEventListener === "function") {
	            return function (element, eventName, handle) {
	                element.removeEventListener(eventName, handle, false);
	            };
	        } else if (typeof document.detachEvent === "function") {
	            return function (element, eventName, handle) {
	                element.detachEvent("on" + eventName, handle);
	            };
	        } else {
	            return function (element, eventName, handle) {
	                element["on" + eventName] = null;
	            };
	        };
	    }()
	};
	
	//Attach to environment
	(function () {
	    var Environment = __webpack_require__(1);
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
	})();
	
	module.exports = Events;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	"strict mode";
	
	function EventCaller(element, eventName) {
	    function extend(destination, source) {
	        for (var property in source) {
	            destination[property] = source[property];
	        }return destination;
	    }
	    var oEvent = null,
	        eventType = null,
	        evt = null,
	        eventMatchers = {
	        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	        'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
	    },
	        defaultOptions = {
	        type: eventName,
	        canBubble: true,
	        cancelable: true,
	        view: element.ownerDocument.defaultView,
	        detail: 1,
	        screenX: 0,
	        screenY: 0,
	        clientX: 0,
	        clientY: 0,
	        pointerX: 0,
	        pointerY: 0,
	        ctrlKey: false,
	        altKey: false,
	        shiftKey: false,
	        metaKey: false,
	        button: 0,
	        relatedTarget: null
	    },
	        options = extend(defaultOptions, arguments[2] || {});
	    for (var name in eventMatchers) {
	        if (eventMatchers[name].test(eventName)) {
	            eventType = name;break;
	        }
	    }
	    if (!eventType) {
	        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
	    }
	    if (document.createEvent) {
	        oEvent = document.createEvent(eventType);
	        if (eventType == 'HTMLEvents') {
	            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
	        } else {
	            oEvent.initMouseEvent(options.type, options.canBubble, options.cancelable, options.view, options.detail, options.screenX, options.screenY, options.clientX, options.clientY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, options.relatedTarget);
	        }
	        element.dispatchEvent(oEvent);
	    } else {
	        options.clientX = options.pointerX;
	        options.clientY = options.pointerY;
	        evt = document.createEventObject();
	        oEvent = extend(evt, options);
	        element.fireEvent('on' + eventName, oEvent);
	    }
	    return element;
	};
	
	//Attach to environment
	(function () {
	    var Environment = __webpack_require__(1);
	    //_node
	    Environment.define.node('events.emulate', function (type) {
	        return EventCaller(this.target, type);
	    });
	    //_nodes
	    Environment.define.nodes('events.emulate', function (type) {
	        Array.prototype.forEach.call(this.target, function (target) {
	            EventCaller(target, type);
	        });
	    });
	})();
	
	module.exports = EventCaller;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var Objects = {
	    forEach: function forEach(object, callback) {
	        if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null) {
	            for (var property in object) {
	                (function (property, object, callback) {
	                    callback(property, object[property]);
	                })(property, object, callback);
	            }
	            if (!('toString' in { toString: null })) {
	                //Hello, IE8 :)
	                Array.prototype.forEach.call(['toString', 'valueOf', 'constructor', 'hasOwnPropery', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString'], function (protoprop) {
	                    if (object.hasOwnProperty(prototype)) {
	                        callback(protoprop, object[property]);
	                    }
	                });
	            }
	        }
	    }
	};
	
	//Attach to environment
	(function () {
	    var Environment = __webpack_require__(1);
	    Environment.define.object('forEach', function (callback) {
	        return Objects.forEach(this.target, callback);
	    });
	})();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var unique = __webpack_require__(6);
	
	var Settings = function Settings() {
	    _classCallCheck(this, Settings);
	
	    this.STORAGE_PROPERTY = 'STORAGE_PROPERTY';
	    this.HANDLE_ID_PROPERTY = 'HANDLE_ID_PROPERTY';
	};
	
	var Storage = function () {
	    function Storage(object) {
	        _classCallCheck(this, Storage);
	
	        this.parent = object;
	        this.binds = {};
	        this.settings = new Settings();
	    }
	
	    _createClass(Storage, [{
	        key: 'make',
	        value: function make(property, value) {
	            if (!this.binds[property]) {
	                this.binds[property] = {
	                    current: value,
	                    previous: value,
	                    setter: function (value) {
	                        this.binds[property].previous = this.binds[property].current;
	                        this.binds[property].current = value;
	                        for (var id in this.binds[property].handles) {
	                            this.binds[property].handles[id].call(this.parent, this.binds[property].current, this.binds[property].previous, id);
	                        }
	                    }.bind(this),
	                    getter: function () {
	                        return this.binds[property].current;
	                    }.bind(this),
	                    handles: {}
	                };
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: 'add',
	        value: function add(property, handle) {
	            var handleID = unique();
	            handle[this.settings.HANDLE_ID_PROPERTY] = handleID;
	            this.binds[property].handles[handleID] = handle;
	            return handleID;
	        }
	    }, {
	        key: 'remove',
	        value: function remove(property, id) {
	            if (this.binds[property]) {
	                if (this.binds[property].handles[id]) {
	                    delete this.binds[property].handles[id];
	                    if (Object.keys(this.binds[property].handles).length === 0) {
	                        return delete this.binds[property];
	                    }
	                }
	            }
	            return null;
	        }
	    }, {
	        key: 'kill',
	        value: function kill(property) {
	            if (this.binds[property]) {
	                return delete this.binds[property];
	            }
	            return null;
	        }
	    }, {
	        key: 'isPropertyReady',
	        value: function isPropertyReady(property) {
	            return this.binds[property] !== void 0 ? true : false;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            if (Object.keys(this.binds).length === 0) {
	                return delete this.parent[this.settings.STORAGE_PROPERTY];
	            }
	            return false;
	        }
	    }, {
	        key: 'setter',
	        value: function setter(property) {
	            return this.binds[property].setter;
	        }
	    }, {
	        key: 'getter',
	        value: function getter(property) {
	            return this.binds[property].getter;
	        }
	    }]);
	
	    return Storage;
	}();
	
	var ObjectsBinding = function () {
	    function ObjectsBinding() {
	        _classCallCheck(this, ObjectsBinding);
	
	        this.settings = new Settings();
	    }
	
	    _createClass(ObjectsBinding, [{
	        key: 'bind',
	        value: function bind(object, property, handle) {
	            var storage = this.settings.STORAGE_PROPERTY,
	                value = null;
	            if (Object.defineProperty) {
	                if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof property === 'string' && typeof handle === 'function') {
	                    value = object[property];
	                    if (!object[storage]) {
	                        //Object isn't listening
	                        Object.defineProperty(object, storage, {
	                            value: new Storage(object),
	                            enumerable: false,
	                            configurable: false,
	                            writable: false
	                        });
	                    }
	                    storage = object[storage];
	                    //Prepare property if needed
	                    if (!storage.isPropertyReady(property)) {
	                        //First handle for property
	                        if (delete object[property]) {
	                            //Prepare property storage
	                            storage.make(property, value);
	                            //Bind
	                            Object.defineProperty(object, property, {
	                                get: storage.getter(property),
	                                set: storage.setter(property),
	                                configurable: true
	                            });
	                        } else {
	                            storage.destroy();
	                            return false;
	                        }
	                    }
	                    //Add handle
	                    return storage.add(property, handle);
	                }
	                throw 'object.bind:: INCORRECT_ARGUMENTS';
	            }
	        }
	    }, {
	        key: 'unbind',
	        value: function unbind(object, property, id) {
	            var storage = this.settings.STORAGE_PROPERTY,
	                value = null;
	            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof property === 'string' && typeof id === 'string') {
	                if (object[storage]) {
	                    storage = object[storage];
	                    if (storage.isPropertyReady(property)) {
	                        value = object[property];
	                        storage.remove(property, id);
	                        if (!storage.isPropertyReady(property)) {
	                            try {
	                                delete object[property];
	                                object[property] = value;
	                                return true;
	                            } catch (e) {
	                                throw 'object.unbind:: PROPERTY_IS_CONST';
	                            }
	                        }
	                    }
	                }
	                return null;
	            }
	            throw 'object.unbind:: INCORRECT_ARGUMENTS';
	        }
	    }, {
	        key: 'kill',
	        value: function kill(object, property) {
	            var storage = this.settings.STORAGE_PROPERTY,
	                value = null;
	            if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof property === 'string') {
	                if (object[storage]) {
	                    value = object[property];
	                    storage = object[storage];
	                    try {
	                        if (storage.kill(property)) {
	                            delete object[property];
	                            object[property] = value;
	                            return true;
	                        } else {
	                            return false;
	                        }
	                    } catch (e) {
	                        throw 'object.kill:: PROPERTY_IS_CONST';
	                    }
	                }
	                return null;
	            }
	            throw 'object.kill::' + errors.objects.INCORRECT_ARGUMENTS;
	        }
	    }]);
	
	    return ObjectsBinding;
	}();
	
	//Attach to environment
	
	
	(function () {
	    var Environment = __webpack_require__(1),
	        objectsBinding = new ObjectsBinding();
	    Environment.define.object('bind', function (property, handle) {
	        return objectsBinding.bind(this.target, property, handle);
	    });
	    Environment.define.object('unbind', function (property, id) {
	        return objectsBinding.bind(this.target, property, id);
	    });
	    Environment.define.object('kill', function (property) {
	        return objectsBinding.bind(this.target, property);
	    });
	})();

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	var unique = function () {
	    var cache = [];
	    return function () {
	        function getID() {
	            var codeA = 'A'.charCodeAt(0),
	                codeZ = 'Z'.charCodeAt(0),
	                range = codeZ - codeA,
	                result = '';
	
	            for (var i = 4; i >= 0; i -= 1) {
	                i !== 4 && (result += '-');
	                for (var j = 4; j >= 0; j -= 1) {
	                    if (Math.random() > 0.5) {
	                        result += String.fromCharCode(codeA + Math.floor(Math.random() * range));
	                    } else {
	                        result += Math.floor(Math.random() * 9).toString();
	                    }
	                }
	            }
	            return result;
	        }
	        var result = '';
	        do {
	            result = getID();
	        } while (~cache.indexOf(result));
	        cache.push(result);
	        return result;
	    };
	}();
	module.exports = unique;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var unique = __webpack_require__(6);
	
	var Template = function () {
	    function Template(html, hooks) {
	        var _this = this;
	
	        var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	
	        _classCallCheck(this, Template);
	
	        var _html = html;
	        this.html = html;
	        this.id = id;
	        this.hooks = {};
	        //Create hooks accessors
	        _object(hooks).forEach(function (hook, smth) {
	            if (smth instanceof Array) {
	                this.hooks[hook] = [];
	                smth.forEach(function (smth) {
	                    this.hooks[hook].push(function () {
	                        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	                        this.html = this.html.replace(smth, value);
	                        return this.hooks;
	                    }.bind(this));
	                }.bind(this));
	            } else {
	                this.hooks[hook] = function () {
	                    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	                    this.html = this.html.replace(smth, value);
	                    return this.hooks;
	                }.bind(this);
	            }
	        }.bind(this));
	        //Reset method
	        this.reset = function () {
	            _this.html = _html;
	        };
	    }
	
	    _createClass(Template, [{
	        key: 'getDOM',
	        value: function getDOM() {
	            //Here should be check for compatibility to prevent errors for example with tables (TD, TR) and other similar cases
	            var wrapper = document.createElement('div');
	            wrapper.innerHTML = this.html;
	            return wrapper.children.length === 1 ? wrapper.children[0] : wrapper.children;
	        }
	    }, {
	        key: 'mount',
	        value: function mount() {
	            var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
	
	            //Here should be check for compatibility to prevent errors for example with tables (TD, TR) and other similar cases
	            var wrapper = document.createElement('div');
	            wrapper.innerHTML = this.html;
	            if (parent.appendChild !== void 0) {
	                for (var i = wrapper.children.length - 1; i >= 0; i -= 1) {
	                    parent.appendChild(wrapper.children[0]);
	                }
	                return true;
	            }
	            return false;
	        }
	    }]);
	
	    return Template;
	}();
	
	var Templates = function () {
	    function Templates() {
	        _classCallCheck(this, Templates);
	
	        this.cache = {};
	    }
	
	    _createClass(Templates, [{
	        key: 'load',
	        value: function load(id) {
	            var _this2 = this;
	
	            var template = _node('*[id="' + id + '"]').target;
	            if (template !== null) {
	                if (this.cache[id] === void 0) {
	                    (function () {
	                        template = template.innerHTML;
	                        var hooks = template.match(/\{\{[\w\d_\.]*?\}\}/gi),
	                            _hooks = {};
	                        if (hooks instanceof Array) {
	                            hooks.forEach(function (hook) {
	                                var hook_id = unique(),
	                                    _hook = hook.replace(/\{|\}/gi, '');
	                                if (_hooks[_hook] === void 0) {
	                                    _hooks[_hook] = hook_id;
	                                } else if (_hooks[_hook] instanceof Array) {
	                                    _hooks[_hook].push(hook_id);
	                                } else {
	                                    _hooks[_hook] = [_hooks[_hook]];
	                                    _hooks[_hook].push(hook_id);
	                                }
	                                template = template.replace(hook, hook_id);
	                            });
	                        }
	                        _this2.cache[id] = new Template(template, _hooks, id);
	                    })();
	                }
	                return this.cache[id];
	            }
	            return null;
	        }
	    }]);
	
	    return Templates;
	}();
	
	module.exports = new Templates();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Templates = __webpack_require__(7),
	    unique = __webpack_require__(6);
	
	var Dialog = function () {
	    function Dialog() {
	        _classCallCheck(this, Dialog);
	
	        this.wrapper = null;
	        this.dialog = null;
	        this.button = null;
	    }
	    //button = {caption: STRING, callback: FUNCTION}
	
	
	    _createClass(Dialog, [{
	        key: 'show',
	        value: function show(_ref) {
	            var _this = this;
	
	            var _ref$parent = _ref.parent,
	                parent = _ref$parent === undefined ? document.body : _ref$parent,
	                _ref$buttons = _ref.buttons,
	                buttons = _ref$buttons === undefined ? [] : _ref$buttons,
	                _ref$content = _ref.content,
	                content = _ref$content === undefined ? '' : _ref$content,
	                _ref$title = _ref.title,
	                title = _ref$title === undefined ? '' : _ref$title;
	
	            if (content !== null) {
	                this.wrapper = this.wrapper === null ? Templates.load('wrapper') : this.wrapper;
	                this.dialog = this.dialog === null ? Templates.load('dialog') : this.dialog;
	                this.button = this.button === null ? Templates.load('button') : this.button;
	                if (this.wrapper !== null && this.dialog !== null && this.button !== null) {
	                    var _ret = function () {
	                        var instance_id = unique(),
	                            buttons_html = '',
	                            buttons_handles = buttons.map(function (button) {
	                            var button_id = unique();
	                            button.close = button.close === void 0 ? true : button.close;
	                            _this.button.reset();
	                            _this.button.hooks.id(button_id);
	                            _this.button.hooks.caption(button.caption);
	                            buttons_html += _this.button.html;
	                            return {
	                                id: button_id,
	                                callback: function (instance_id, callback, close) {
	                                    typeof callback === 'function' && callback();
	                                    close && this.close(instance_id);
	                                }.bind(_this, instance_id, button.callback, button.close)
	                            };
	                        });
	                        _this.dialog.reset();
	                        _this.wrapper.reset();
	                        _this.dialog.hooks.title(title).buttons(buttons_html).content(content);
	                        _this.wrapper.hooks.id(instance_id).content(_this.dialog.html);
	                        _this.wrapper.mount(parent);
	                        buttons_handles.forEach(function (button) {
	                            _node('div[id="' + instance_id + '"] a[id="' + button.id + '"]').events().add('click', button.callback);
	                        });
	                        return {
	                            v: instance_id
	                        };
	                    }();
	
	                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	                }
	            }
	            return false;
	        }
	    }, {
	        key: 'close',
	        value: function close(instance_id) {
	            var wrapper = _node('div[id="' + instance_id + '"]').target;
	            wrapper !== null && wrapper.parentNode.removeChild(wrapper);
	        }
	    }]);
	
	    return Dialog;
	}();
	
	module.exports = new Dialog();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Templates = __webpack_require__(7),
	    unique = __webpack_require__(6);
	
	var Progress = function () {
	    function Progress() {
	        _classCallCheck(this, Progress);
	
	        this.pattern = null;
	    }
	
	    _createClass(Progress, [{
	        key: 'show',
	        value: function show(_ref) {
	            var _ref$parent = _ref.parent,
	                parent = _ref$parent === undefined ? document.body : _ref$parent,
	                _ref$caption = _ref.caption,
	                caption = _ref$caption === undefined ? '' : _ref$caption;
	
	            this.pattern = this.pattern === null ? Templates.load('progress') : this.pattern;
	            if (this.pattern !== null) {
	                var instance_id = unique();
	                this.pattern.reset();
	                this.pattern.hooks.id(instance_id).caption(caption);
	                this.pattern.mount(parent);
	                return instance_id;
	            }
	            return false;
	        }
	    }, {
	        key: 'close',
	        value: function close(instance_id) {
	            var pattern = _node('div[id="' + instance_id + '"]').target;
	            pattern !== null && pattern.parentNode.removeChild(pattern);
	        }
	    }]);
	
	    return Progress;
	}();
	
	module.exports = new Progress();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	"strict mode";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var events = __webpack_require__(2);
	
	var TextFileReader = function () {
	    function TextFileReader(file) {
	        _classCallCheck(this, TextFileReader);
	
	        if (window.FileReader !== void 0) {
	            if (typeof file !== 'undefined') {
	                this.file = file;
	            } else {
	                throw new Error('File should be defined.');
	            }
	        } else {
	            throw new Error('Browser does not support fs API.');
	        }
	    }
	
	    _createClass(TextFileReader, [{
	        key: 'load',
	        value: function load(callback) {
	            var fileReader = new FileReader();
	            events.add(fileReader, 'load', function (event) {
	                fileReader = null;
	                if (event.target !== void 0 && event.target.result !== void 0) {
	                    typeof callback === 'function' && callback(event.target.result, void 0);
	                } else {
	                    typeof callback === 'function' && callback(void 0, event);
	                }
	            });
	            events.add(fileReader, 'error', function (event) {
	                fileReader = null;
	                typeof callback === 'function' && callback(void 0, event);
	            });
	            fileReader.readAsText(this.file);
	        }
	    }]);
	
	    return TextFileReader;
	}();
	
	module.exports = TextFileReader;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Templates = __webpack_require__(7),
	    unique = __webpack_require__(6);
	
	var JSONRender = function () {
	    function JSONRender() {
	        _classCallCheck(this, JSONRender);
	
	        this.property = null;
	        this.sub = null;
	        this.results = null;
	    }
	
	    _createClass(JSONRender, [{
	        key: 'getPropHTML',
	        value: function getPropHTML(prop, value) {
	            var html = '';
	            if (value instanceof Array) {
	                var inside = '',
	                    id = unique();
	                value.forEach(function (value, index) {
	                    inside += this.getPropHTML(index, value);
	                }.bind(this));
	                this.property.reset();
	                this.sub.reset();
	                this.sub.hooks.id[0](id).id[1](id).list(inside);
	                this.property.hooks.name('"' + prop + '"').value('');
	                html += this.property.html;
	                html += this.sub.html;
	            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
	                var _inside = '',
	                    _id = unique();
	                _object(value).forEach(function (prop, value) {
	                    _inside += this.getPropHTML(prop, value);
	                }.bind(this));
	                this.property.reset();
	                this.sub.reset();
	                this.sub.hooks.id[0](_id).id[1](_id).list(_inside);
	                this.property.hooks.name('"' + prop + '"').value('');
	                html += this.property.html;
	                html += this.sub.html;
	            } else {
	                this.property.reset();
	                this.property.hooks.name('"' + prop + '" :').value((typeof value === 'string' ? '"' : '') + (value.toString !== void 0 ? value.toString() : 'Parsing error...') + (typeof value === 'string' ? '"' : '')).type(typeof value === 'undefined' ? 'undefined' : _typeof(value));
	                html += this.property.html;
	            }
	            return html;
	        }
	    }, {
	        key: 'render',
	        value: function render(_ref) {
	            var _ref$parent = _ref.parent,
	                parent = _ref$parent === undefined ? document.body : _ref$parent,
	                _ref$data = _ref.data,
	                data = _ref$data === undefined ? null : _ref$data,
	                callback = _ref.callback;
	
	            if (data !== null) {
	                this.property = this.property === null ? Templates.load('property') : this.property;
	                this.sub = this.sub === null ? Templates.load('property-sub') : this.sub;
	                this.results = this.results === null ? Templates.load('json-results') : this.results;
	                //Do work without blocking process
	                setTimeout(function () {
	                    var instance_id = unique(),
	                        html = function () {
	                        var _this = this;
	
	                        var html = '';
	                        if (data instanceof Array) {
	                            data.forEach(function (value, prop) {
	                                html += _this.getPropHTML(prop, value);
	                            });
	                        } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data !== null) {
	                            _object(data).forEach(function (prop, value) {
	                                html += _this.getPropHTML(prop, value);
	                            });
	                        } else {
	                            html = data.toString();
	                        }
	                        return html;
	                    }.bind(this)();
	                    this.results.reset();
	                    this.results.hooks.content(html).id(instance_id);
	                    this.results.mount(parent);
	                    typeof callback === 'function' && callback(instance_id);
	                }.bind(this), 1);
	                return true;
	            }
	            return false;
	        }
	    }, {
	        key: 'close',
	        value: function close(instance_id) {
	            var results = _node('div[id="' + instance_id + '"]').target;
	            results !== null && results.parentNode.removeChild(results);
	        }
	    }]);
	
	    return JSONRender;
	}();
	
	module.exports = JSONRender;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Templates = __webpack_require__(7),
	    unique = __webpack_require__(6);
	
	var Section = function () {
	    function Section(data, placeholder) {
	        _classCallCheck(this, Section);
	
	        this.section = Templates.load('section');
	        this.id = unique();
	        this.data = data;
	        this.refs = {
	            parent: null,
	            count: null,
	            memory: null,
	            marker: null
	        };
	        this.mem = 0;
	        this.placeholder = placeholder;
	    }
	
	    _createClass(Section, [{
	        key: 'get',
	        value: function get() {
	            this.section.reset();
	            this.section.hooks.id(this.id).name(this.data.info.name).memType(this.data.info.memType);
	            return this.section.html;
	        }
	    }, {
	        key: 'getRefs',
	        value: function getRefs() {
	            this.refs.parent === null && (this.refs.parent = _node('*[id="' + this.id + '"]').target);
	            this.refs.count === null && (this.refs.count = _node('*[id="' + this.id + '"] span.count').target);
	            this.refs.memory === null && (this.refs.memory = _node('*[id="' + this.id + '"] span.memory').target);
	            this.refs.marker === null && (this.refs.marker = _node('*[id="' + this.id + '"] span.marker').target);
	            return this.refs.count !== null ? this.refs.memory !== null ? this.refs.marker !== null : false : false;
	        }
	    }, {
	        key: 'memUpdate',
	        value: function memUpdate() {
	            var _this = this;
	
	            this.mem = 0;
	            this.data.childs.forEach(function (child) {
	                _this.mem += child.size;
	            });
	            if (this.mem === 0 && this.refs.parent !== null) {
	                !~this.refs.parent.className.indexOf('inactive') && (this.refs.parent.className += ' inactive');
	            } else {
	                this.refs.parent.className = this.refs.parent.className.replace(' inactive', '');
	            }
	            return this.mem;
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            if (this.getRefs()) {
	                this.refs.count.innerHTML = Object.keys(this.data.childs).length;
	                this.refs.memory.innerHTML = this.memUpdate();
	            }
	        }
	    }, {
	        key: 'memory',
	        value: function memory(total) {
	            this.getRefs() && (this.refs.marker.style.width = this.mem / total * 100 + '%');
	        }
	    }, {
	        key: 'init',
	        value: function init() {
	            var _this2 = this;
	
	            if (this.getRefs()) {
	                _node(this.refs.parent).events().add('click', function (event) {
	                    var Progress = __webpack_require__(9),
	                        JSONRender = __webpack_require__(11),
	                        progress_id = Progress.show({ caption: 'please, wait...' }),
	                        JSONrender = new JSONRender(),
	                        placeholder = _node(_this2.placeholder).target;
	                    placeholder.innerHTML = '';
	                    //Make little timeout to be sure, that progress bar is rendered
	                    setTimeout(function () {
	                        JSONrender.render({
	                            parent: placeholder,
	                            data: function () {
	                                var rendered = {};
	                                this.data.childs.forEach(function (child) {
	                                    rendered[child.processName] = child;
	                                });
	                                return rendered;
	                            }.bind(_this2)(),
	                            callback: function callback() {
	                                Progress.close(progress_id);
	                            }
	                        });
	                    }, 50);
	                });
	            }
	        }
	    }]);
	
	    return Section;
	}();
	
	var Processes = function () {
	    function Processes(data) {
	        _classCallCheck(this, Processes);
	
	        this.wrapper = Templates.load('map');
	        this.data = data;
	        this.structured = null;
	        this.sections = [];
	        this.memory = [];
	        this.id = unique();
	        this.mem = {
	            total: 0
	        };
	        this.refs = {
	            processes: null
	        };
	        this.shakeTimer = null;
	    }
	
	    _createClass(Processes, [{
	        key: 'getStructure',
	        value: function getStructure() {
	            var _this3 = this;
	
	            function getChilds(smth, section) {
	                var childs = [];
	                if ((typeof smth === 'undefined' ? 'undefined' : _typeof(smth)) === 'object' && smth !== null) {
	                    if (smth.section === void 0) {
	                        Object.keys(smth).forEach(function (key) {
	                            if (_typeof(smth[key]) === 'object' && smth[key] !== null) {
	                                if (smth[key].section !== void 0 && smth[key].section === section) {
	                                    smth[key].processName = key;
	                                    childs.push(smth[key]);
	                                } else {
	                                    childs = childs.concat(getChilds(smth[key], section));
	                                }
	                            }
	                        });
	                    } else if (smth.section === section) {
	                        smth[key].processName = key;
	                        childs.push(smth);
	                    }
	                }
	                return childs;
	            };
	            var sections = {},
	                memory = {},
	                all = [];
	            if (this.data.sections !== void 0 && this.data.symbols !== void 0) {
	                Object.keys(this.data.sections).forEach(function (section) {
	                    var name = _this3.data.sections[section].name;
	                    sections[name] = {};
	                    sections[name].info = _this3.data.sections[name];
	                    sections[name].childs = getChilds(_this3.data.symbols, section);
	                    all = all.concat(sections[name].childs);
	                });
	                Object.keys(this.data.sections).forEach(function (section) {
	                    memory[_this3.data.sections[section].memType] === void 0 && (memory[_this3.data.sections[section].memType] = {});
	                    memory[_this3.data.sections[section].memType].info = {
	                        memType: _this3.data.sections[section].memType,
	                        size: 0
	                    };
	                    memory[_this3.data.sections[section].memType].childs === void 0 && (memory[_this3.data.sections[section].memType].childs = []);
	                    memory[_this3.data.sections[section].memType].childs = memory[_this3.data.sections[section].memType].childs.concat(sections[section].childs);
	                });
	            }
	            this.structured = {
	                sections: sections,
	                memory: memory,
	                all: all
	            };
	        }
	    }, {
	        key: 'memUpdate',
	        value: function memUpdate() {
	            var _this4 = this;
	
	            this.mem = {
	                total: 0
	            };
	            this.structured.all.forEach(function (process) {
	                process.memType !== void 0 && (_this4.mem[process.memType] = _this4.mem[process.memType] === void 0 ? 0 : _this4.mem[process.memType]);
	                process.size !== void 0 && (_this4.mem.total += process.size);
	                process.size !== void 0 && (_this4.mem[process.memType] += process.size);
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render(_ref) {
	            var _this5 = this;
	
	            var _ref$parent = _ref.parent,
	                parent = _ref$parent === undefined ? document.body : _ref$parent,
	                callback = _ref.callback;
	
	            //do not block a stream
	            setTimeout(function () {
	                var placeholder = '*[id="' + _this5.id + '"] div.processes';
	                _this5.getStructure();
	                _object(_this5.structured.sections).forEach(function (id, section) {
	                    _this5.sections.push(new Section(section, placeholder));
	                });
	                _object(_this5.structured.memory).forEach(function (id, memory) {
	                    _this5.memory.push(new Section(memory, placeholder));
	                });
	                _this5.wrapper.hooks.id(_this5.id).sections(function () {
	                    var html = '';
	                    this.sections.forEach(function (section) {
	                        html += section.get();
	                    });
	                    return html;
	                }.bind(_this5)()).memories(function () {
	                    var html = '';
	                    this.memory.forEach(function (mem) {
	                        html += mem.get();
	                    });
	                    return html;
	                }.bind(_this5)());
	                _this5.wrapper.mount(parent);
	                _this5.init();
	                _this5.update();
	                _this5.shakeAttach();
	                typeof callback === 'function' && callback();
	            }, 50);
	        }
	    }, {
	        key: 'bind',
	        value: function bind() {
	            var _this6 = this;
	
	            this.structured.all.forEach(function (process) {
	                _object(process).bind('size', function (e, cur, prev) {
	                    _this6.update();
	                });
	            });
	        }
	    }, {
	        key: 'shake',
	        value: function shake() {
	            var _this7 = this;
	
	            var target = this.structured.all[Math.floor((this.structured.all.length - 1) * Math.random())];
	            target.size += Math.floor((target.memType === 'ram' ? 500000 : 5000) * Math.random());
	            this.shakeTimer = setTimeout(function () {
	                _this7.shake();
	            }, 100);
	        }
	    }, {
	        key: 'shakeAttach',
	        value: function shakeAttach() {
	            _node('div[id="' + this.id + '"] a.shake').events().add('click', this.shakeTrigger.bind(this));
	        }
	    }, {
	        key: 'shakeTrigger',
	        value: function shakeTrigger(event) {
	            function setLabel(val) {
	                _node('div[id="' + this.id + '"] a.shake span').target.innerHTML = val;
	            };
	            if (this.shakeTimer === null) {
	                this.shake();
	                setLabel.call(this, 'OFF');
	            } else {
	                clearTimeout(this.shakeTimer);
	                this.shakeTimer = null;
	                setLabel.call(this, 'ON');
	            }
	        }
	    }, {
	        key: 'init',
	        value: function init() {
	            this.sections.forEach(function (section) {
	                section.init();
	            });
	            this.memory.forEach(function (memory) {
	                memory.init();
	            });
	            this.bind();
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            var _this8 = this;
	
	            this.memUpdate();
	            this.sections.forEach(function (section) {
	                section.update();
	                section.memory(_this8.mem.total);
	            });
	            this.memory.forEach(function (memory) {
	                memory.update();
	                memory.memory(_this8.mem.total);
	            });
	        }
	    }, {
	        key: 'close',
	        value: function close() {
	            var results = _node('div[id="' + this.id + '"]').target;
	            results !== null && results.parentNode.removeChild(results);
	        }
	    }]);
	
	    return Processes;
	}();
	
	module.exports = Processes;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Events = __webpack_require__(2),
	    unique = __webpack_require__(6),
	    Controller = null;
	
	var Request = function () {
	    function Request(url, method, parameters, callbacks, settings) {
	        _classCallCheck(this, Request);
	
	        this.settings = settings;
	        this.url = url;
	        this.method = method;
	        this.parameters = parameters;
	        this.callbacks = callbacks;
	        this.response = null;
	        this.responseHeaders = null;
	        this.httpRequest = null;
	    }
	
	    _createClass(Request, [{
	        key: 'send',
	        value: function send() {
	            try {
	                //Add request to journal
	                Controller.requests.add(this);
	                this.httpRequest = new XMLHttpRequest();
	                if (this.httpRequest !== null) {
	                    Events.add(this.httpRequest, 'readystatechange', this.readystatechange.bind(this));
	                    Events.add(this.httpRequest, 'timeout', this.timeout.bind(this));
	                    this.httpRequest.timeout = this.settings.timeout;
	                    this.callback(this.callbacks.before);
	                    switch (this.method) {
	                        case Controller.settings.methods.POST:
	                            this.httpRequest.open(this.method, this.url, true);
	                            this.setHeaders();
	                            this.httpRequest.send(this.parameters._parameters);
	                            break;
	                        case Controller.settings.methods.GET:
	                            this.httpRequest.open(this.method, this.url + (this.parameters._parameters !== '' ? '?' : '') + this.parameters._parameters, true);
	                            this.setHeaders();
	                            this.httpRequest.send();
	                            break;
	                        default:
	                            this.httpRequest.open(this.method, this.url, true);
	                            this.setHeaders();
	                            this.httpRequest.send(this.parameters._parameters);
	                            break;
	                    }
	                    return true;
	                } else {
	                    throw new Error('Fail create XMLHttpRequest');
	                }
	            } catch (e) {
	                this.callback(this.callbacks.fail, e);
	                this.destroy();
	            }
	        }
	    }, {
	        key: 'setHeaders',
	        value: function setHeaders() {
	            //Set headers
	            if (this.settings.headers !== null) {
	                for (var key in this.settings.headers) {
	                    this.httpRequest.setRequestHeader(key, this.settings.headers[key]);
	                }
	            }
	        }
	    }, {
	        key: 'readystatechange',
	        value: function readystatechange(event) {
	            if (Controller.requests.isConflict(this.settings.id) !== false) {
	                if (event.target) {
	                    if (event.target.readyState) {
	                        this.callback(this.callbacks.reaction, event);
	                        switch (event.target.readyState) {
	                            case 2:
	                                //Get headers
	                                this.responseHeaders = this.parseHeaders(event.target.getAllResponseHeaders());
	                                this.callback(this.callbacks.headers, event);
	                                break;
	                            case 4:
	                                //Get response
	                                if (event.target.status === 200) {
	                                    //Success
	                                    this.response = this.parse(event.target.responseText);
	                                    this.destroy();
	                                    this.callback(this.callbacks.success, event);
	                                    return true;
	                                } else {
	                                    //Fail
	                                    this.destroy();
	                                    this.callback(this.callbacks.fail, event);
	                                    return false;
	                                }
	                        }
	                    }
	                }
	            }
	        }
	    }, {
	        key: 'timeout',
	        value: function timeout(event) {
	            if (Controller.requests.isConflict(this.settings.id) !== false) {
	                this.callback(this.callbacks.timeout, event);
	                this.destroy();
	            }
	        }
	    }, {
	        key: 'parse',
	        value: function parse(response) {
	            var result = {
	                original: response,
	                parsed: void 0
	            };
	            try {
	                //Try get JSON object
	                result.parsed = JSON.parse(response);
	            } catch (e) {
	                //Do nothing
	            } finally {
	                return result;
	            }
	        }
	    }, {
	        key: 'parseHeaders',
	        value: function parseHeaders(headers) {
	            var result = {
	                _headers: headers,
	                headers: {}
	            },
	                temp = null;
	            if (typeof headers === 'string') {
	                temp = headers.split('\r\n');
	                if (temp instanceof Array) {
	                    temp.forEach(function (header) {
	                        var data = header.split(':');
	                        if (data instanceof Array) {
	                            if (data[0] !== '') {
	                                result.headers[data[0]] = header.replace(data[0] + ':', '');
	                            }
	                        }
	                    });
	                }
	            }
	            return result;
	        }
	    }, {
	        key: 'callback',
	        value: function callback(_callback, event) {
	            if (_callback !== null) {
	                _callback(this.response, {
	                    id: this.id,
	                    event: event !== void 0 ? event : null,
	                    headers: this.responseHeaders,
	                    response: this.response,
	                    parameters: this.parameters,
	                    url: this.url,
	                    abort: this.abort.bind(this)
	                });
	            }
	        }
	    }, {
	        key: 'abort',
	        value: function abort() {
	            if (this.httpRequest !== null) {
	                if (typeof this.httpRequest.abort === 'function') {
	                    this.httpRequest.abort();
	                }
	            }
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            Controller.requests.remove(this);
	        }
	    }]);
	
	    return Request;
	}();
	
	var Controller = {
	    settings: {
	        DEFAULT_TIMEOUT: 15000,
	        DEFAULT_METHOD: 'GET',
	        methods: {
	            POST: 'POST',
	            GET: 'GET',
	            PUT: 'PUT',
	            DELETE: 'DELETE',
	            OPTIONS: 'OPTIONS'
	        },
	        regs: {
	            URLENCODED: /-urlencoded/gi,
	            JSON: /application\/json/gi
	        },
	        headers: {
	            CONTENT_TYPE: 'Content-Type',
	            ACCEPT: 'Accept'
	        }
	    },
	    requests: {
	        storage: {},
	        add: function add(request) {
	            var storage = Controller.requests.storage;
	            if (storage[request.settings.id] === void 0) {
	                storage[request.settings.id] = request;
	                return true;
	            }
	            return false;
	        },
	        remove: function remove(request) {
	            var storage = Controller.requests.storage;
	            if (storage[request.settings.id] !== void 0) {
	                storage[request.settings.id] = null;
	                delete storage[request.settings.id];
	                return true;
	            }
	            return false;
	        },
	        isConflict: function isConflict(id) {
	            return Controller.requests.storage[id] === void 0 ? false : true;
	        }
	    },
	    create: function create(url, method, parameters, callbacks, settings) {
	        var request = null;
	        //Parse parameters
	        url = typeof url === 'string' ? url : null;
	        method = typeof method === 'string' ? [Controller.settings.methods.POST, Controller.settings.methods.GET, Controller.settings.methods.PUT, Controller.settings.methods.DELETE, Controller.settings.methods.OPTIONS].indexOf(method.toUpperCase()) !== -1 ? method.toUpperCase() : Controller.settings.DEFAULT_METHOD : Controller.settings.DEFAULT_METHOD;
	        settings = Controller.parse.settings(settings);
	        parameters = Controller.parse.parameters(parameters, settings);
	        callbacks = Controller.parse.callbacks(callbacks);
	        if (url !== null) {
	            return new Request(url, method, parameters, callbacks, settings);
	        }
	        return null;
	    },
	    parse: {
	        settings: function settings(settings) {
	            var settings = (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) === 'object' ? settings !== null ? settings : {} : {};
	            settings.id = typeof settings.id === 'string' ? settings.id : typeof settings.id === 'number' ? settings.id : unique();
	            settings.id = Controller.requests.isConflict(settings.id) === false ? settings.id : unique();
	            settings.timeout = typeof settings.timeout === 'number' ? settings.timeout : Controller.settings.DEFAULT_TIMEOUT;
	            settings.doNotChangeHeaders = typeof settings.doNotChangeHeaders === 'boolean' ? settings.doNotChangeHeaders : false, settings.doNotChangeParameters = typeof settings.doNotChangeParameters === 'boolean' ? settings.doNotChangeParameters : false, settings.doNotEncodeParametersAsURL = typeof settings.doNotEncodeParametersAsURL === 'boolean' ? settings.doNotEncodeParametersAsURL : false, settings.headers = Controller.parse.headers(settings);
	            return settings;
	        },
	        parameters: function parameters(_parameters, settings) {
	            var parameters = _parameters,
	                params = {},
	                str_params = '',
	                excluded = [],
	                encodeURI = null;
	            if (!settings.doNotChangeParameters) {
	                if (parameters instanceof Array) {
	                    //If as parameters we have string (after it was convert to array)
	                    Array.prototype.forEach.call(parameters, function (parameter, index) {
	                        var property = null;
	                        parameters[index] = param.replace(/^\s*\?/gi, '');
	                        property = parameters[index].split('=');
	                        if (property instanceof Array) {
	                            if (property.length === 2) {
	                                params[property[0]] = property[1];
	                            } else {
	                                excluded.push(parameters[index]);
	                            }
	                        } else {
	                            excluded.push(parameters[index]);
	                        }
	                    });
	                } else if ((typeof parameters === 'undefined' ? 'undefined' : _typeof(parameters)) === 'object' && parameters !== null) {
	                    //If as parameters we have object
	                    for (var key in parameters) {
	                        switch (_typeof(parameters[key])) {
	                            case 'string':
	                                params[key] = parameters[key];
	                                break;
	                            case 'boolean':
	                                params[key] = parameters[key].toString();
	                                break;
	                            case 'number':
	                                params[key] = parameters[key].toString();
	                                break;
	                            case 'object':
	                                params[key] = JSON.stringify(parameters[key]);
	                                break;
	                            default:
	                                try {
	                                    params[key] = JSON.stringify(parameters[key]);
	                                } catch (e) {}
	                                break;
	                        }
	                        params[key] = params[key];
	                    }
	                }
	                if (typeof _parameters !== 'string') {
	                    //Make parameters string
	                    Controller.settings.regs.JSON.lastIndex = 0;
	                    Controller.settings.regs.URLENCODED.lastIndex = 0;
	                    if (Controller.settings.regs.JSON.test(settings.headers[Controller.settings.headers.CONTENT_TYPE])) {
	                        str_params = JSON.stringify(params);
	                    } else {
	                        encodeURI = Controller.settings.regs.URLENCODED.test(settings.headers[Controller.settings.headers.CONTENT_TYPE]);
	                        encodeURI = settings.doNotEncodeParametersAsURL ? false : encodeURI;
	                        for (var key in params) {
	                            str_params += '&' + key + '=' + (encodeURI ? encodeURIComponent(params[key]) : params[key]);
	                        }
	                        str_params = str_params.replace(/^\s*\&/gi, '');
	                    }
	                } else {
	                    str_params = _parameters;
	                }
	            } else {
	                str_params = _parameters;
	            }
	            //Return result
	            return {
	                original: _parameters,
	                parameters: params,
	                _parameters: str_params,
	                excluded: excluded
	            };
	        },
	        callbacks: function callbacks(_callbacks) {
	            var callbacks = {};
	            if ((typeof _callbacks === 'undefined' ? 'undefined' : _typeof(_callbacks)) === 'object' && _callbacks !== null) {
	                callbacks.before = typeof _callbacks.before === 'function' ? _callbacks.before : null;
	                callbacks.success = typeof _callbacks.success === 'function' ? _callbacks.success : null;
	                callbacks.fail = typeof _callbacks.fail === 'function' ? _callbacks.fail : null;
	                callbacks.reaction = typeof _callbacks.reaction === 'function' ? _callbacks.reaction : null;
	                callbacks.timeout = typeof _callbacks.timeout === 'function' ? _callbacks.timeout : null;
	                callbacks.headers = typeof _callbacks.headers === 'function' ? _callbacks.headers : null;
	            }
	            return callbacks;
	        },
	        headers: function headers(settings) {
	            var _headers = {};
	            if (!settings.doNotChangeHeaders) {
	                if (_typeof(settings.headers) === 'object' && settings.headers !== null) {
	                    oop.objects.forEach(settings.headers, function (key, value) {
	                        var parts = key.split('-');
	                        parts.forEach(function (part, index) {
	                            parts[index] = part.charAt(0).toUpperCase() + part.slice(1);
	                        });
	                        _headers[parts.join('-')] = value;
	                    });
	                }
	                //Default headers
	                if (_headers[Controller.settings.headers.CONTENT_TYPE] === void 0) {
	                    _headers[Controller.settings.headers.CONTENT_TYPE] = 'application/x-www-form-urlencoded';
	                }
	                if (_headers[Controller.settings.headers.ACCEPT] === void 0) {
	                    _headers[Controller.settings.headers.ACCEPT] = '*/*';
	                }
	            } else {
	                _headers = _typeof(settings.headers) === 'object' ? settings.headers !== null ? settings.headers : {} : {};
	            }
	            settings.headers = _headers;
	            return settings.headers;
	        }
	    }
	};
	
	module.exports = Controller.create;

/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map