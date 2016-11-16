"use strict";
var Response = require('../response.js');
class Commands {
    game() {
        return [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)];
    }
    bonus() {
        return Math.random() <= 0.25;
    }
}
class Controller {
    constructor(response, data) {
        this.response   = response;
        this.data       = data;
        this.commands   = new Commands();
    }
    proceed() {
        if (this.data.command !== void 0) {
            if (this.commands[this.data.command] !== void 0) {
                Response.text(this.response, {
                    results : this.commands[this.data.command](this.data),
                    bonus   : this.commands.bonus(),
                    error   : null
                });
            } else {
                Response.text(this.response, { error: 'Unknow command: [' + this.data.command + ']' });
            }
        } else {
            Response.text(this.response, { error: 'Cannot find parameter [command] for game [' + this.data.game +']' });
        }
    }
}
module.exports = Controller;