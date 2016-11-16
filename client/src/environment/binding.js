var unique = require('../environment/unique.js');
class Settings {
    constructor() {
        this.STORAGE_PROPERTY   = 'STORAGE_PROPERTY';
        this.HANDLE_ID_PROPERTY = 'HANDLE_ID_PROPERTY';
    }
}
class Storage{
    constructor(object){
        this.parent     = object;
        this.binds      = {};
        this.settings   = new Settings();
    }
    make (property, value) {
        if (!this.binds[property]) {
            this.binds[property] = {
                current     : value,
                previous    : value,
                setter      : function (value) { 
                    this.binds[property].previous   = this.binds[property].current;
                    this.binds[property].current    = value;
                    for (var id in this.binds[property].handles) {
                        this.binds[property].handles[id].call(this.parent, this.binds[property].current, this.binds[property].previous, id);
                    }
                }.bind(this),
                getter      : function () {
                    return this.binds[property].current;
                }.bind(this),
                handles     : {}
            };
            return true;
        }
        return false;
    }
    add (property, handle) {
        var handleID = unique();
        handle[this.settings.HANDLE_ID_PROPERTY]    = handleID;
        this.binds[property].handles[handleID]      = handle;
        return handleID;
    }
    remove (property, id) {
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
    kill (property) {
        if (this.binds[property]) {
            return delete this.binds[property];
        }
        return null;
    }
    isPropertyReady (property){
        return this.binds[property] !== void 0 ? true : false;
    }
    destroy (){
        if (Object.keys(this.binds).length === 0) {
            return delete this.parent[this.settings.STORAGE_PROPERTY];
        }
        return false;
    }
    setter (property) {
        return this.binds[property].setter;
    }
    getter (property) {
        return this.binds[property].getter;
    }
}
class ObjectsBinding {
    constructor() {
        this.settings = new Settings();
    }
    bind(object, property, handle) {
        var storage = this.settings.STORAGE_PROPERTY,
            value   = null;
        if (Object.defineProperty) {
            if (typeof object === 'object' && typeof property === 'string' && typeof handle === 'function') {
                value = object[property];
                if (!object[storage]) {
                    //Object isn't listening
                    Object.defineProperty(object, storage, {
                        value       : new Storage(object),
                        enumerable  : false,
                        configurable: false,
                        writable    : false
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
                            get         : storage.getter(property),
                            set         : storage.setter(property),
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
    unbind(object, property, id) {
        var storage = this.settings.STORAGE_PROPERTY,
            value   = null;
        if (typeof object === 'object' && typeof property === 'string' && typeof id === 'string') {
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
    kill(object, property) {
        var storage = this.settings.STORAGE_PROPERTY,
            value   = null;
        if (typeof object === 'object' && typeof property === 'string') {
            if (object[storage]) {
                value   = object[property];
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
}

//Attach to environment
(function () {
    let Environment     = require('./environment.js'),
        objectsBinding  = new ObjectsBinding();
    Environment.define.object('bind', function (property, handle) {
        return objectsBinding.bind(this.target, property, handle);
    });
    Environment.define.object('unbind', function (property, id) {
        return objectsBinding.bind(this.target, property, id);
    });
    Environment.define.object('kill', function (property) {
        return objectsBinding.bind(this.target, property);
    });
} ());