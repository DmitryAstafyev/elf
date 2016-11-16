"use strict";
var Templates   = require('../environment/template.js'),
    unique      = require('../environment/unique.js');
class Section {
    constructor(data, placeholder) {
        this.section        = Templates.load('section');
        this.id             = unique();
        this.data           = data;
        this.refs           = {
            parent  : null,
            count   : null,
            memory  : null,
            marker  : null
        };
        this.mem            = 0;
        this.placeholder    = placeholder;
    }
    get() {
        this.section.reset();
        this.section.hooks  .id(this.id)
                            .name(this.data.info.name)
                            .memType(this.data.info.memType);
        return this.section.html;
    }
    getRefs() {
        this.refs.parent    === null && (this.refs.parent   = _node('*[id="' + this.id + '"]').target);
        this.refs.count     === null && (this.refs.count    = _node('*[id="' + this.id + '"] span.count').target);
        this.refs.memory    === null && (this.refs.memory   = _node('*[id="' + this.id + '"] span.memory').target);
        this.refs.marker    === null && (this.refs.marker   = _node('*[id="' + this.id + '"] span.marker').target);
        return (this.refs.count !== null ? (this.refs.memory !== null ? (this.refs.marker !== null) : false) : false);
    }
    memUpdate() {
        this.mem = 0;
        this.data.childs.forEach((child) => {
            this.mem += child.size;
        });
        if (this.mem === 0 && this.refs.parent !== null) {
            !~this.refs.parent.className.indexOf('inactive') && (this.refs.parent.className += ' inactive');
        } else {
            this.refs.parent.className = this.refs.parent.className.replace(' inactive', '');
        }
        return this.mem;
    }
    update() {
        if (this.getRefs()) {
            this.refs.count.innerHTML   = Object.keys(this.data.childs).length;
            this.refs.memory.innerHTML  = this.memUpdate();
        }
    }
    memory(total) {
        this.getRefs() && (this.refs.marker.style.width = (this.mem / total) * 100 + '%');
    }
    init() {
        if (this.getRefs()) {
            _node(this.refs.parent).events().add('click', (event) => {
                let Progress    = require('../elements/progress.js'),
                    JSONRender  = require('../components/json.render.js'),
                    progress_id = Progress.show({ caption: 'please, wait...' }),
                    JSONrender  = new JSONRender(),
                    placeholder = _node(this.placeholder).target;
                placeholder.innerHTML = '';
                //Make little timeout to be sure, that progress bar is rendered
                setTimeout(() => {
                    JSONrender.render({
                        parent  : placeholder,
                        data    : (function () { 
                            let rendered = {};
                            this.data.childs.forEach((child) => {
                                rendered[child.processName] = child;
                            });
                            return rendered;
                        }.bind(this)()),
                        callback: () => {
                            Progress.close(progress_id);
                        }
                    });
                }, 50);
            });
        }
    }
}
class Processes {
    constructor(data) {
        this.wrapper    = Templates.load('map');
        this.data       = data;
        this.structured = null;
        this.sections   = [];
        this.memory     = [];
        this.id         = unique();
        this.mem        = {
            total: 0,
        };
        this.refs       = {
            processes : null
        };
        this.shakeTimer = null;
    }
    getStructure() {
        function getChilds(smth, section){
            var childs = [];
            if (typeof smth === 'object' && smth !== null) {
                if (smth.section === void 0) {
                    Object.keys(smth).forEach((key) => {
                        if (typeof smth[key] === 'object' && smth[key] !== null) {
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
        var sections    = {},
            memory      = {},
            all         = [];
        if (this.data.sections !== void 0 && this.data.symbols !== void 0) {
            Object.keys(this.data.sections).forEach((section) => {
                let name                = this.data.sections[section].name;
                sections[name]          = {};
                sections[name].info     = this.data.sections[name];
                sections[name].childs   = getChilds(this.data.symbols, section);
                all                     = all.concat(sections[name].childs);
            });
            Object.keys(this.data.sections).forEach((section) => {
                memory[this.data.sections[section].memType] === void 0 && (memory[this.data.sections[section].memType] = {});
                memory[this.data.sections[section].memType].info = {
                    memType : this.data.sections[section].memType,
                    size    : 0
                };
                memory[this.data.sections[section].memType].childs === void 0 && (memory[this.data.sections[section].memType].childs = []);
                memory[this.data.sections[section].memType].childs = memory[this.data.sections[section].memType].childs.concat(sections[section].childs);
            });
        }
        this.structured = {
            sections: sections,
            memory  : memory,
            all     : all
        };
    }
    memUpdate() {
        this.mem = {
            total: 0,
        };
        this.structured.all.forEach((process) => {
            process.memType !== void 0 && (this.mem[process.memType] = this.mem[process.memType] === void 0 ? 0 : this.mem[process.memType]);
            process.size    !== void 0 && (this.mem.total += process.size);
            process.size    !== void 0 && (this.mem[process.memType] += process.size);
        });
    }
    render({parent = document.body, callback}) {
        //do not block a stream
        setTimeout(() => {
            let placeholder = '*[id="' + this.id + '"] div.processes';
            this.getStructure();
            _object(this.structured.sections).forEach((id, section) => {
                this.sections.push(new Section(section, placeholder));
            });
            _object(this.structured.memory).forEach((id, memory) => {
                this.memory.push(new Section(memory, placeholder));
            });
            this.wrapper.hooks  .id(this.id)
                                .sections((function () {
                                    let html = '';
                                    this.sections.forEach((section) => { html += section.get(); });
                                    return html;
                                }.bind(this)()))
                                .memories((function () {
                                    let html = '';
                                    this.memory.forEach((mem) => { html += mem.get(); });
                                    return html;
                                }.bind(this)()));
            this.wrapper.mount(parent);
            this.init();
            this.update();
            this.shakeAttach();
            typeof callback === 'function' && callback();
        }, 50);
    }
    bind() {
        this.structured.all.forEach((process) => {
            _object(process).bind('size', (e, cur, prev) => {
                this.update();
            });
        });
    }
    shake() {
        var target = this.structured.all[Math.floor((this.structured.all.length - 1) * Math.random())];
        target.size += Math.floor((target.memType === 'ram' ? 500000 : 5000) * Math.random());
        this.shakeTimer = setTimeout(() => {
            this.shake();
        }, 100);
    }
    shakeAttach() {
        _node('div[id="' + this.id + '"] a.shake').events().add('click', this.shakeTrigger.bind(this));
    }
    shakeTrigger(event) {
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
    init() {
        this.sections.  forEach((section)   => { section.   init(); });
        this.memory.    forEach((memory)    => { memory.    init(); });
        this.bind();
    }
    update() {
        this.memUpdate();
        this.sections.forEach((section) => {
            section.update();
            section.memory(this.mem.total);
        });
        this.memory.forEach((memory) => {
            memory.update();
            memory.memory(this.mem.total);
        });
    }
    close() {
        var results = _node('div[id="' + this.id + '"]').target;
        results !== null && results.parentNode.removeChild(results);
    }
}
module.exports = Processes;