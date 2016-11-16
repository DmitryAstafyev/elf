"use strict";
var Templates   = require('../environment/template.js'),
    unique      = require('../environment/unique.js');

class JSONRender {
    constructor() {
        this.property   = null;
        this.sub        = null;
        this.results    = null;
    }
    getPropHTML(prop, value) {
        var html = '';
        if (value instanceof Array) {
            let inside  = '',
                id      = unique();
            value.forEach(function (value, index) {
                inside += this.getPropHTML(index, value);
            }.bind(this));
            this.property.reset();
            this.sub.reset();
            this.sub.hooks.id[0](id).id[1](id).list(inside);
            this.property.hooks.name('"' + prop + '"').value('');
            html += this.property.html;
            html += this.sub.html;
        } else if (typeof value === 'object' && value !== null) {
            let inside  = '',
                id      = unique();
            _object(value).forEach(function (prop, value) {
                inside += this.getPropHTML(prop, value);    
            }.bind(this));
            this.property.reset();
            this.sub.reset();
            this.sub.hooks.id[0](id).id[1](id).list(inside);
            this.property.hooks.name('"' + prop + '"').value('');
            html += this.property.html;
            html += this.sub.html;
        } else {
            this.property.reset();
            this.property.hooks .name('"' + prop + '" :')
                                .value((typeof value === 'string' ? '"' : '') + (value.toString !== void 0 ? value.toString() : 'Parsing error...') + (typeof value === 'string' ? '"' : ''))
                                .type(typeof value);
            html += this.property.html;
        }
        return html;
    }
    render({parent = document.body, data = null, callback}) {
        if (data !== null) {
            this.property   = this.property === null ? Templates.load('property')       : this.property;
            this.sub        = this.sub      === null ? Templates.load('property-sub')   : this.sub;
            this.results    = this.results  === null ? Templates.load('json-results')   : this.results;
            //Do work without blocking process
            setTimeout(function () {
                let instance_id = unique(),
                    html        = (function(){
                        let html = '';
                        if (data instanceof Array) {
                            data.forEach((value, prop) => {
                                html += this.getPropHTML(prop, value);
                            });
                        } else if (typeof data === 'object' && data !== null) {
                            _object(data).forEach((prop, value) => {
                                html += this.getPropHTML(prop, value);
                            });
                        } else {
                            html = data.toString();
                        }
                        return html;
                    }.bind(this)());
                this.results.reset();
                this.results.hooks.content(html).id(instance_id);
                this.results.mount(parent);
                typeof callback === 'function' && callback(instance_id);
            }.bind(this), 1);
            return true;
        }
        return false;
    }
    close(instance_id) {
        var results = _node('div[id="' + instance_id + '"]').target;
        results !== null && results.parentNode.removeChild(results);
    }
}
module.exports = JSONRender;