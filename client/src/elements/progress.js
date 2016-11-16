"use strict";
var Templates   = require('../environment/template.js'),
    unique      = require('../environment/unique.js');

class Progress {
    constructor() {
        this.pattern = null;
    }
    show({parent = document.body, caption = ''}) {
        this.pattern = this.pattern === null ? Templates.load('progress') : this.pattern;
        if (this.pattern !== null) {
            let instance_id = unique();
            this.pattern.reset();
            this.pattern.hooks  .id(instance_id)
                                .caption(caption);
            this.pattern.mount(parent);
            return instance_id;
        }
        return false;
    }
    close(instance_id) {
        var pattern = _node('div[id="' + instance_id + '"]').target;
        pattern !== null && pattern.parentNode.removeChild(pattern);
    }
}
module.exports = new Progress();