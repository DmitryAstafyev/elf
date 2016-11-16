var Events      = require('./events'),
    unique      = require('./unique'),
    Controller  = null;
class Request {
    constructor(url, method, parameters, callbacks, settings) {
        this.settings           = settings;
        this.url                = url;
        this.method             = method;
        this.parameters         = parameters;
        this.callbacks          = callbacks;
        this.response           = null;
        this.responseHeaders    = null;
        this.httpRequest        = null;
    }
    send (){
        try {
            //Add request to journal
            Controller.requests.add(this);
            this.httpRequest = new XMLHttpRequest();
            if (this.httpRequest !== null) {
                Events.add(this.httpRequest, 'readystatechange',    this.readystatechange.bind(this));
                Events.add(this.httpRequest, 'timeout',             this.timeout.bind(this));
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
    setHeaders (){
        //Set headers
        if (this.settings.headers !== null) {
            for (var key in this.settings.headers) {
                this.httpRequest.setRequestHeader(key, this.settings.headers[key]);
            }
        }
    }
    readystatechange (event) {
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
    timeout (event) {
        if (Controller.requests.isConflict(this.settings.id) !== false) {
            this.callback(this.callbacks.timeout, event);
            this.destroy();
        }
    }
    parse (response){
        var result = {
                original: response,
                parsed  : void 0
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
    parseHeaders (headers) {
        var result  = {
                _headers: headers,
                headers : {}
            },
            temp    = null;
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
    callback (callback, event) {
        if (callback !== null) {
            callback(this.response,
            {
                id          : this.id,
                event       : event !== void 0 ? event : null,
                headers     : this.responseHeaders,
                response    : this.response,
                parameters  : this.parameters,
                url         : this.url,
                abort       : this.abort.bind(this)
            });
        }
    }
    abort () {
        if (this.httpRequest !== null) {
            if (typeof this.httpRequest.abort === 'function') {
                this.httpRequest.abort();
            }
        }
    }
    destroy () {
        Controller.requests.remove(this);
    }
}

var Controller = {
    settings    : {
        DEFAULT_TIMEOUT : 15000, 
        DEFAULT_METHOD  : 'GET',
        methods         : {
            POST    : 'POST',
            GET     : 'GET',
            PUT     : 'PUT',
            DELETE  : 'DELETE',
            OPTIONS : 'OPTIONS',
        },
        regs            : {
            URLENCODED  : /-urlencoded/gi,
            JSON        : /application\/json/gi
        },
        headers         :{
            CONTENT_TYPE    : 'Content-Type',
            ACCEPT          : 'Accept'
        }
    },
    requests    : {
        storage     : {},
        add         : function (request) {
            var storage = Controller.requests.storage;
            if (storage[request.settings.id] === void 0) {
                storage[request.settings.id] = request;
                return true;
            }
            return false;
        },
        remove      : function (request) {
            var storage = Controller.requests.storage;
            if (storage[request.settings.id] !== void 0) {
                storage[request.settings.id] = null;
                delete storage[request.settings.id];
                return true;
            }
            return false;
        },
        isConflict  : function (id) {
            return Controller.requests.storage[id] === void 0 ? false : true;
        }
    },
    create      : function (url, method, parameters, callbacks, settings) {
        var request = null;
        //Parse parameters
        url         = (typeof url       === 'string' ? url : null);
        method      = (typeof method    === 'string' ? ([
            Controller.settings.methods.POST,
            Controller.settings.methods.GET,
            Controller.settings.methods.PUT,
            Controller.settings.methods.DELETE,
            Controller.settings.methods.OPTIONS].indexOf(method.toUpperCase()) !== -1 ? method.toUpperCase() : Controller.settings.DEFAULT_METHOD) : Controller.settings.DEFAULT_METHOD);
        settings    = Controller.parse.settings(settings);
        parameters  = Controller.parse.parameters(parameters, settings);
        callbacks   = Controller.parse.callbacks(callbacks);
        if (url !== null) {
            return new Request(url, method, parameters, callbacks, settings);
        }
        return null;
    },
    parse       : {
        settings    : function (settings){
            var settings                        = typeof settings === 'object' ? (settings !== null ? settings : {}) : {};
            settings.id                         = (typeof settings.id === 'string' ? settings.id : (typeof settings.id === 'number' ? settings.id       : unique()));
            settings.id                         = (Controller.requests.isConflict(settings.id) === false        ? settings.id                           : unique());
            settings.timeout                    = (typeof settings.timeout                      === 'number'    ? settings.timeout                      : Controller.settings.DEFAULT_TIMEOUT);
            settings.doNotChangeHeaders         = typeof settings.doNotChangeHeaders            === 'boolean'   ? settings.doNotChangeHeaders           : false,
            settings.doNotChangeParameters      = typeof settings.doNotChangeParameters         === 'boolean'   ? settings.doNotChangeParameters        : false,
            settings.doNotEncodeParametersAsURL = typeof settings.doNotEncodeParametersAsURL    === 'boolean'   ? settings.doNotEncodeParametersAsURL   : false,
            settings.headers                    = Controller.parse.headers(settings);
            return settings;
        },
        parameters  : function (_parameters, settings) {
            var parameters  = _parameters,
                params      = {},
                str_params  = '',
                excluded    = [],
                encodeURI   = null;
            if (!settings.doNotChangeParameters) {
                if (parameters instanceof Array) {
                    //If as parameters we have string (after it was convert to array)
                    Array.prototype.forEach.call(
                        parameters,
                        function (parameter, index) {
                            var property = null;
                            parameters[index]   = param.replace(/^\s*\?/gi, '');
                            property            = parameters[index].split('=');
                            if (property instanceof Array) {
                                if (property.length === 2) {
                                    params[property[0]] = property[1];
                                } else {
                                    excluded.push(parameters[index]);
                                }
                            } else {
                                excluded.push(parameters[index]);
                            }
                        }
                    );
                } else if (typeof parameters === 'object' && parameters !== null) {
                    //If as parameters we have object
                    for (var key in parameters) {
                        switch(typeof parameters[key]){
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
                                try{
                                    params[key] = JSON.stringify(parameters[key]);
                                } catch (e) { }
                                break;
                        }
                        params[key] = params[key];
                    }
                }
                if (typeof _parameters !== 'string') {
                    //Make parameters string
                    Controller.settings.regs.JSON.lastIndex       = 0;
                    Controller.settings.regs.URLENCODED.lastIndex = 0;
                    if (Controller.settings.regs.JSON.test(settings.headers[Controller.settings.headers.CONTENT_TYPE])) {
                        str_params = JSON.stringify(params);
                    } else {
                        encodeURI = Controller.settings.regs.URLENCODED.test(settings.headers[Controller.settings.headers.CONTENT_TYPE]);
                        encodeURI = settings.doNotEncodeParametersAsURL ? false : encodeURI;
                        for (var key in params) {
                            str_params += ('&' + key + '=' + (encodeURI ? encodeURIComponent(params[key]) : params[key]));
                        }
                        str_params = str_params.replace(/^\s*\&/gi, '');
                    }
                } else {
                    str_params = _parameters;
                }
            } else {
                str_params  = _parameters;
            }
            //Return result
            return {
                original    : _parameters,
                parameters  : params,
                _parameters : str_params,
                excluded    : excluded
            }
        },
        callbacks   : function (_callbacks) {
            var callbacks = {};
            if (typeof _callbacks === 'object' && _callbacks !== null) {
                callbacks.before    = typeof _callbacks.before      === 'function' ? _callbacks.before      : null;
                callbacks.success   = typeof _callbacks.success     === 'function' ? _callbacks.success     : null;
                callbacks.fail      = typeof _callbacks.fail        === 'function' ? _callbacks.fail        : null;
                callbacks.reaction  = typeof _callbacks.reaction    === 'function' ? _callbacks.reaction    : null;
                callbacks.timeout   = typeof _callbacks.timeout     === 'function' ? _callbacks.timeout     : null;
                callbacks.headers   = typeof _callbacks.headers     === 'function' ? _callbacks.headers     : null;
            }
            return callbacks;
        },
        headers     : function (settings) {
            var _headers = {};
            if (!settings.doNotChangeHeaders) {
                if (typeof settings.headers === 'object' && settings.headers !== null) {
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
                _headers = typeof settings.headers === 'object' ? (settings.headers !== null ? settings.headers : {}) : {};
            }
            settings.headers = _headers;
            return settings.headers;
        }
    }
};

module.exports = Controller.create;