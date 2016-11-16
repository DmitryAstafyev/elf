"use strict";
var qs          = require('querystring');
const ERRORS    = {
    WRONG_REQUEST           : 'PostGetter can be used only for POST requests',
    TOO_BIG_DATA_IN_REQUEST : 'TOO_BIG_DATA_IN_REQUEST'
};
class PostGetter {
    constructor(request, callback, limit = 10000000 /*~10MB*/) {
        if (request.method === 'POST') {
            this.request    = request;
            this.limit      = typeof limit === 'number' ? limit : 100000000;//~100MB
            this.data       = '';
        } else {
            throw new Error(ERRORS.WRONG_REQUEST);
        }
    }
    get(callback) {
        this.callback = callback;
        this.request.on('data',     this.proceed.bind(this));
        this.request.on('end',      this.finish.bind(this));
        this.request.on('error',    this.error.bind(this));
    }
    proceed (data) {
        this.data += data;
        if (this.data.length > this.limit) {
            this.request.connection.destroy();
            this.error(ERRORS.TOO_BIG_DATA_IN_REQUEST);
        }
    }
    finish () {
        if (this.request.headers['content-type'] !== void 0 && this.request.headers['content-type'].indexOf('text/plain') !== -1) {
            try {
                this.data = JSON.parse(this.data);
            } catch (e) {
                this.data = '';
            }
        } else {
            this.data = qs.parse(this.data);
        }
        typeof this.callback === 'function' && this.callback(this.data, null);
    }
    error(err) {
        typeof this.callback === 'function' && this.callback(null, new Error(err));
    }
}
module.exports = PostGetter;
