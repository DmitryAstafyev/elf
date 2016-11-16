"use strict";
var unique = require('./unique.js');
class Template {
    constructor(html, hooks, id = null) {
        var _html   = html;
        this.html   = html;
        this.id     = id;
        this.hooks  = {};
        //Create hooks accessors
        _object(hooks).forEach(function(hook, smth) {
            if (smth instanceof Array) {
                this.hooks[hook] = [];
                smth.forEach(function (smth) {
                    this.hooks[hook].push(function (value = '') {
                        this.html = this.html.replace(smth, value);
                        return this.hooks;
                    }.bind(this));
                }.bind(this));
            } else {
                this.hooks[hook] = function (value = '') {
                    this.html = this.html.replace(smth, value);
                    return this.hooks;
                }.bind(this);
            }
        }.bind(this));
        //Reset method
        this.reset = () => {
            this.html = _html;
        };
    }
    getDOM() {
        //Here should be check for compatibility to prevent errors for example with tables (TD, TR) and other similar cases
        var wrapper         = document.createElement('div');
        wrapper.innerHTML   = this.html;
        return wrapper.children.length === 1 ? wrapper.children[0] : wrapper.children;
    }
    mount(parent = document.body) {
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
}
class Templates {
    constructor() {
        this.cache = {};
    }
    load(id) {
        var template = _node('*[id="' + id + '"]').target;
        if (template !== null) {
            if (this.cache[id] === void 0) {
                template = template.innerHTML;
                let hooks   = template.match(/\{\{[\w\d_\.]*?\}\}/gi),
                    _hooks  = {};
                if (hooks instanceof Array) {
                    hooks.forEach((hook) => {
                        let hook_id = unique(),
                            _hook   = hook.replace(/\{|\}/gi, '');
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
                this.cache[id] = new Template(template, _hooks, id);
            }
            return this.cache[id];
        }
        return null;
    }
}
module.exports = new Templates();