"use strict";
var wrappers = null;
//Wrapper to give comfortable access to DOM and other stuff
wrappers        = {
    callers     : {
        node    : (function () {
            var cache = {};
            return function (selector, use_cache, document_link) {
                var node        = null,
                    use_cache   = typeof use_cache === 'boolean' ? use_cache : false;
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
        }()),
        nodes   : (function () {
            var cache = {};
            return function (selector, use_cache, document_link) {
                var nodes       = null,
                    use_cache   = typeof use_cache === 'boolean' ? use_cache : false;
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
        }()),
        array   : function (_array) {
            if (_array instanceof Array) {
                return new wrappers.constructors.array(_array);
            } else {
                return null;
            }
        },
        object  : function (_object) {
            if (typeof _object === 'object') {
                return new wrappers.constructors.object(_object);
            } else {
                return null;
            }
        },
    },
    prototypes  : {
        node    : {},
        nodes   : {},
        array   : {},
        object  : {},
        update  : {
            update  : function (target) {
                function update(obj) {
                    var updated = null;
                    for (var pro in obj) {
                        if (obj.hasOwnProperty(pro)) {
                            if (typeof obj[pro] === 'object' && pro !== 'target') {
                                updated = function () { updated.target = this.target; return updated; };
                                for (var subpro in obj[pro]) {
                                    updated[subpro] = obj[pro][subpro];
                                }
                                obj[pro] = updated;
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
            node    : function () { wrappers.prototypes.update.update('node'    ); },
            nodes   : function () { wrappers.prototypes.update.update('nodes'   ); },
            array   : function () { wrappers.prototypes.update.update('array'   ); },
            object  : function () { wrappers.prototypes.update.update('object'  ); }
        },
        add     : {
            add     : function (target, path, value) {
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
                                    proto           = proto[property];
                                }
                            } else if (typeof proto[property] === 'object' || typeof proto[property] === 'function') {
                                proto           = proto[property];
                            } else {
                                proto[property] = {};
                                proto           = proto[property];
                            }
                        });
                        wrappers.prototypes.update[target]();
                    }
                }
            },
            node    : function (path, value) { wrappers.prototypes.add.add('node',      path, value); },
            nodes   : function (path, value) { wrappers.prototypes.add.add('nodes',     path, value); },
            array   : function (path, value) { wrappers.prototypes.add.add('array',     path, value); },
            object  : function (path, value) { wrappers.prototypes.add.add('object',    path, value); }
        }
    },
    constructors: {
        node    : function (node    ) { this.target = node;     },
        nodes   : function (nodes   ) { this.target = nodes;    },
        array   : function (array   ) { this.target = array;    },
        object  : function (object  ) { this.target = object;   }
    },
    build       : function () {
        for (var constructor in wrappers.constructors) {
            wrappers.constructors[constructor].prototype = wrappers.prototypes[constructor];
        }
        return true;
    }
};
//Build wrappers
wrappers.build();
//Define short callers
window['_node'      ] = wrappers.callers.node;
window['_nodes'     ] = wrappers.callers.nodes;
window['_array'     ] = wrappers.callers.array;
window['_object'    ] = wrappers.callers.object;

module.exports = {
    define: {
        node    : wrappers.prototypes.add.node,
        nodes   : wrappers.prototypes.add.nodes,
        array   : wrappers.prototypes.add.array,
        object  : wrappers.prototypes.add.object,
    }
};