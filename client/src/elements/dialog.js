"use strict";
var Templates   = require('../environment/template.js'),
    unique      = require('../environment/unique.js');

class Dialog {
    constructor() {
        this.wrapper    = null;
        this.dialog     = null;
        this.button     = null;
    }
    //button = {caption: STRING, callback: FUNCTION}
    show({parent = document.body, buttons = [], content = '', title = ''}) {
        if (content !== null) {
            this.wrapper    = this.wrapper  === null ? Templates.load('wrapper')    : this.wrapper;
            this.dialog     = this.dialog   === null ? Templates.load('dialog')     : this.dialog;
            this.button     = this.button   === null ? Templates.load('button')     : this.button;
            if (this.wrapper !== null && this.dialog !== null && this.button !== null) {
                let instance_id         = unique(),
                    buttons_html        = '',
                    buttons_handles     = buttons.map((button)=>{
                        let button_id   = unique();
                        button.close    = button.close === void 0 ? true : button.close;
                        this.button.reset();
                        this.button.hooks.id(button_id);
                        this.button.hooks.caption(button.caption);
                        buttons_html += this.button.html;
                        return {
                            id      : button_id,
                            callback: function (instance_id, callback, close) {
                                typeof callback === 'function' && callback();
                                close && this.close(instance_id);
                            }.bind(this, instance_id, button.callback, button.close)
                        };
                    });
                this.dialog.reset();
                this.wrapper.reset();
                this.dialog.hooks   .title(title)
                                    .buttons(buttons_html)
                                    .content(content);
                this.wrapper.hooks  .id(instance_id)
                                    .content(this.dialog.html);
                this.wrapper.mount(parent);
                buttons_handles.forEach((button) => {
                    _node('div[id="' + instance_id + '"] a[id="' + button.id + '"]').events().add('click', button.callback);
                });
                return instance_id;
            }
        }
        return false;
    }
    close(instance_id) {
        var wrapper = _node('div[id="' + instance_id + '"]').target;
        wrapper !== null && wrapper.parentNode.removeChild(wrapper);
    }
}
module.exports = new Dialog();