!function(modules){function t(n){if(e[n])return e[n].exports;var o=e[n]={exports:{},id:n,loaded:!1};return modules[n].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var e={};return t.m=modules,t.c=e,t.p="",t(0)}([function(t,exports,e){"use strict";var n=(e(1),e(2)),o=(e(3),e(4),e(5),e(6),e(7),e(8)),r=e(9),i=e(10),s=e(11),a=e(12),u=e(13);n.add(window,"load",function(){function t(){var t="fileloaderinput",s=null;s=o.show({title:"Welcome",content:'To start you should select a source-file or you can use default source.<input id="'+t+'" type="file"/>',buttons:[{caption:"Get from my harddrive",callback:function(){_node('*[id="'+t+'"]').events().add("change",function(t){if(void 0!==t.target&&void 0!==t.target.files&&1===t.target.files.length&&""!==t.target.files[0].name){var o=t.target.files[0].name.match(/\w*$/i);o=o instanceof Array&&1===o.length?o[0].toLowerCase():null,"json"===o&&!function(){var o=new i(t.target.files[0]),s=r.show({caption:"load file..."});o.load(function(t,o){if(r.close(s),"undefined"!=typeof t){s=r.show({caption:"parsing file..."});try{n=JSON.parse(t)}catch(t){}finally{r.close(s),e()}}})}()}return t}),_node('*[id="'+t+'"]').events().emulate("click")}},{caption:"Use default data-source",callback:function(){var t=u("./data/elf.json","GET",null,{success:function(t){n=t.parsed,e()}});t.send()}}]})}function e(){o.show({title:"How to render",content:"Cool! We have some data. How do you want render it?",buttons:[{caption:"Show me structure of memory",callback:function(){window.__data=n;var t=new a(n),e=r.show({caption:"rendering object..."});t.render({callback:function(){r.close(e)}})},close:!0},{caption:"Just show me JSON object",callback:function(){var t=new s,e=r.show({caption:"rendering object..."});t.render({data:n,callback:function(){r.close(e)}})}}]})}var n=null;t()})},function(t,exports){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n=null;n={callers:{node:function(){var t={};return function(e,o,r){var i=null,o="boolean"==typeof o&&o;return"string"==typeof e?(o&&t[e]&&null!==t[e]&&(i=t[e]),i=null!==i?i:(r||document).querySelector(e),o&&!t[e]&&null!==i&&(t[e]=i),new n.constructors.node(i)):void 0===e||"string"!=typeof e.nodeName&&e!=window?null:new n.constructors.node(e)}}(),nodes:function(){var t={};return function(e,o,r){var i=null,o="boolean"==typeof o&&o;if("string"==typeof e)return o&&t[e]&&null!==t[e]&&t[e].length>0&&(i=t[e]),i=null!==i?i:(r||document).querySelectorAll(e),o&&!t[e]&&null!==i&&i.length>0&&(t[e]=i),new n.constructors.nodes(i);if(void 0!==e&&"number"==typeof e.length&&e.length>0){if("string"==typeof e[0])return i=[],Array.prototype.forEach.call(e,function(t,e){var n=(r||document).querySelector(t);null!==n&&i.push(n)}),new n.constructors.nodes(i);if("string"==typeof e[0].nodeName)return new n.constructors.nodes(e)}return null}}(),array:function(t){return t instanceof Array?new n.constructors.array(t):null},object:function(t){return"object"===("undefined"==typeof t?"undefined":e(t))?new n.constructors.object(t):null}},prototypes:{node:{},nodes:{},array:{},object:{},update:{update:function t(o){function t(n){var o=null;for(var r in n)if(n.hasOwnProperty(r))if("object"===e(n[r])&&"target"!==r){o=function(){return o.target=this.target,o};for(var i in n[r])o[i]=n[r][i];n[r]=o}else"function"==typeof n[r]&&t(n[r])}n.prototypes[o]&&t(n.prototypes[o])},node:function(){n.prototypes.update.update("node")},nodes:function(){n.prototypes.update.update("nodes")},array:function(){n.prototypes.update.update("array")},object:function(){n.prototypes.update.update("object")}},add:{add:function(t,o,r){var i=null,s=null;"string"==typeof t&&"string"==typeof o&&void 0!==r&&n.prototypes[t]&&(i=o.split("."),s=n.prototypes[t],i.forEach(function(t,n){void 0===s[t]?n===i.length-1?s[t]=r:(s[t]={},s=s[t]):"object"===e(s[t])||"function"==typeof s[t]?s=s[t]:(s[t]={},s=s[t])}),n.prototypes.update[t]())},node:function(t,e){n.prototypes.add.add("node",t,e)},nodes:function(t,e){n.prototypes.add.add("nodes",t,e)},array:function(t,e){n.prototypes.add.add("array",t,e)},object:function(t,e){n.prototypes.add.add("object",t,e)}}},constructors:{node:function(t){this.target=t},nodes:function(t){this.target=t},array:function(t){this.target=t},object:function(t){this.target=t}},build:function(){for(var t in n.constructors)n.constructors[t].prototype=n.prototypes[t];return!0}},n.build(),window._node=n.callers.node,window._nodes=n.callers.nodes,window._array=n.callers.array,window._object=n.callers.object,t.exports={define:{node:n.prototypes.add.node,nodes:n.prototypes.add.nodes,array:n.prototypes.add.array,object:n.prototypes.add.object}}},function(t,exports,e){"use strict";var n={add:function(){return"function"==typeof window.addEventListener?function(t,e,n){var o=e instanceof Array?e:[e];Array.prototype.forEach.call(o,function(e){t.addEventListener(e,n,!1)})}:"function"==typeof document.attachEvent?function(t,e,n){var o=e instanceof Array?e:[e];Array.prototype.forEach.call(o,function(e){t.attachEvent("on"+e,n)})}:function(t,e,n){var o=e instanceof Array?e:[e];Array.prototype.forEach.call(o,function(e){t["on"+e]=n})}}(),remove:function(){return"function"==typeof window.removeEventListener?function(t,e,n){t.removeEventListener(e,n,!1)}:"function"==typeof document.detachEvent?function(t,e,n){t.detachEvent("on"+e,n)}:function(t,e,n){t["on"+e]=null}}()};!function(){var t=e(1);t.define.node("events.add",function(t,e){return n.add(this.target,t,e)}),t.define.node("events.remove",function(t,e){return n.remove(this.target,t,e)}),t.define.nodes("events.add",function(t,e){Array.prototype.forEach.call(this.target,function(o){n.add(o,t,e)})}),t.define.nodes("events.remove",function(t,e){Array.prototype.forEach.call(this.target,function(o){n.remove(o,t,e)})})}(),t.exports=n},function(t,exports,e){"use strict";"strict mode";function n(t,e){function n(t,e){for(var n in e)t[n]=e[n];return t}var o=null,r=null,i=null,s={HTMLEvents:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvents:/^(?:click|dblclick|mouse(?:down|up|over|move|out))$/},a={type:e,canBubble:!0,cancelable:!0,view:t.ownerDocument.defaultView,detail:1,screenX:0,screenY:0,clientX:0,clientY:0,pointerX:0,pointerY:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:null},u=n(a,arguments[2]||{});for(var c in s)if(s[c].test(e)){r=c;break}if(!r)throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");return document.createEvent?(o=document.createEvent(r),"HTMLEvents"==r?o.initEvent(e,u.bubbles,u.cancelable):o.initMouseEvent(u.type,u.canBubble,u.cancelable,u.view,u.detail,u.screenX,u.screenY,u.clientX,u.clientY,u.ctrlKey,u.altKey,u.shiftKey,u.metaKey,u.button,u.relatedTarget),t.dispatchEvent(o)):(u.clientX=u.pointerX,u.clientY=u.pointerY,i=document.createEventObject(),o=n(i,u),t.fireEvent("on"+e,o)),t}!function(){var t=e(1);t.define.node("events.emulate",function(t){return n(this.target,t)}),t.define.nodes("events.emulate",function(t){Array.prototype.forEach.call(this.target,function(e){n(e,t)})})}(),t.exports=n},function(t,exports,e){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o={forEach:function(t,e){if("object"===("undefined"==typeof t?"undefined":n(t))&&null!==t){for(var o in t)!function(t,e,n){n(t,e[t])}(o,t,e);"toString"in{toString:null}||Array.prototype.forEach.call(["toString","valueOf","constructor","hasOwnPropery","isPrototypeOf","propertyIsEnumerable","toLocaleString"],function(n){t.hasOwnProperty(prototype)&&e(n,t[o])})}}};!function(){var t=e(1);t.define.object("forEach",function(t){return o.forEach(this.target,t)})}()},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),i=e(6),s=function t(){n(this,t),this.STORAGE_PROPERTY="STORAGE_PROPERTY",this.HANDLE_ID_PROPERTY="HANDLE_ID_PROPERTY"},a=function(){function t(e){n(this,t),this.parent=e,this.binds={},this.settings=new s}return r(t,[{key:"make",value:function(t,e){return!this.binds[t]&&(this.binds[t]={current:e,previous:e,setter:function(e){this.binds[t].previous=this.binds[t].current,this.binds[t].current=e;for(var n in this.binds[t].handles)this.binds[t].handles[n].call(this.parent,this.binds[t].current,this.binds[t].previous,n)}.bind(this),getter:function(){return this.binds[t].current}.bind(this),handles:{}},!0)}},{key:"add",value:function(t,e){var n=i();return e[this.settings.HANDLE_ID_PROPERTY]=n,this.binds[t].handles[n]=e,n}},{key:"remove",value:function(t,e){return this.binds[t]&&this.binds[t].handles[e]&&(delete this.binds[t].handles[e],0===Object.keys(this.binds[t].handles).length)?delete this.binds[t]:null}},{key:"kill",value:function(t){return this.binds[t]?delete this.binds[t]:null}},{key:"isPropertyReady",value:function(t){return void 0!==this.binds[t]}},{key:"destroy",value:function(){return 0===Object.keys(this.binds).length&&delete this.parent[this.settings.STORAGE_PROPERTY]}},{key:"setter",value:function(t){return this.binds[t].setter}},{key:"getter",value:function(t){return this.binds[t].getter}}]),t}(),u=function(){function t(){n(this,t),this.settings=new s}return r(t,[{key:"bind",value:function(t,e,n){var r=this.settings.STORAGE_PROPERTY,i=null;if(Object.defineProperty){if("object"===("undefined"==typeof t?"undefined":o(t))&&"string"==typeof e&&"function"==typeof n){if(i=t[e],t[r]||Object.defineProperty(t,r,{value:new a(t),enumerable:!1,configurable:!1,writable:!1}),r=t[r],!r.isPropertyReady(e)){if(!delete t[e])return r.destroy(),!1;r.make(e,i),Object.defineProperty(t,e,{get:r.getter(e),set:r.setter(e),configurable:!0})}return r.add(e,n)}throw"object.bind:: INCORRECT_ARGUMENTS"}}},{key:"unbind",value:function(t,e,n){var r=this.settings.STORAGE_PROPERTY,i=null;if("object"===("undefined"==typeof t?"undefined":o(t))&&"string"==typeof e&&"string"==typeof n){if(t[r]&&(r=t[r],r.isPropertyReady(e)&&(i=t[e],r.remove(e,n),!r.isPropertyReady(e))))try{return delete t[e],t[e]=i,!0}catch(t){throw"object.unbind:: PROPERTY_IS_CONST"}return null}throw"object.unbind:: INCORRECT_ARGUMENTS"}},{key:"kill",value:function(t,e){var n=this.settings.STORAGE_PROPERTY,r=null;if("object"===("undefined"==typeof t?"undefined":o(t))&&"string"==typeof e){if(t[n]){r=t[e],n=t[n];try{return!!n.kill(e)&&(delete t[e],t[e]=r,!0)}catch(t){throw"object.kill:: PROPERTY_IS_CONST"}}return null}throw"object.kill::"+errors.objects.INCORRECT_ARGUMENTS}}]),t}();!function(){var t=e(1),n=new u;t.define.object("bind",function(t,e){return n.bind(this.target,t,e)}),t.define.object("unbind",function(t,e){return n.bind(this.target,t,e)}),t.define.object("kill",function(t){return n.bind(this.target,t)})}()},function(t,exports){"use strict";var e=function(){var t=[];return function(){function e(){for(var t="A".charCodeAt(0),e="Z".charCodeAt(0),n=e-t,o="",r=4;r>=0;r-=1){4!==r&&(o+="-");for(var i=4;i>=0;i-=1)o+=Math.random()>.5?String.fromCharCode(t+Math.floor(Math.random()*n)):Math.floor(9*Math.random()).toString()}return o}var n="";do n=e();while(~t.indexOf(n));return t.push(n),n}}();t.exports=e},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),r=e(6),i=function(){function t(e,o){var r=this,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;n(this,t);var s=e;this.html=e,this.id=i,this.hooks={},_object(o).forEach(function(t,e){e instanceof Array?(this.hooks[t]=[],e.forEach(function(e){this.hooks[t].push(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.html=this.html.replace(e,t),this.hooks}.bind(this))}.bind(this))):this.hooks[t]=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.html=this.html.replace(e,t),this.hooks}.bind(this)}.bind(this)),this.reset=function(){r.html=s}}return o(t,[{key:"getDOM",value:function(){var t=document.createElement("div");return t.innerHTML=this.html,1===t.children.length?t.children[0]:t.children}},{key:"mount",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body,e=document.createElement("div");if(e.innerHTML=this.html,void 0!==t.appendChild){for(var n=e.children.length-1;n>=0;n-=1)t.appendChild(e.children[0]);return!0}return!1}}]),t}(),s=function(){function t(){n(this,t),this.cache={}}return o(t,[{key:"load",value:function(t){var e=this,n=_node('*[id="'+t+'"]').target;return null!==n?(void 0===this.cache[t]&&!function(){n=n.innerHTML;var o=n.match(/\{\{[\w\d_\.]*?\}\}/gi),s={};o instanceof Array&&o.forEach(function(t){var e=r(),o=t.replace(/\{|\}/gi,"");void 0===s[o]?s[o]=e:s[o]instanceof Array?s[o].push(e):(s[o]=[s[o]],s[o].push(e)),n=n.replace(t,e)}),e.cache[t]=new i(n,s,t)}(),this.cache[t]):null}}]),t}();t.exports=new s},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),i=e(7),s=e(6),a=function(){function t(){n(this,t),this.wrapper=null,this.dialog=null,this.button=null}return r(t,[{key:"show",value:function(t){var e=this,n=t.parent,r=void 0===n?document.body:n,a=t.buttons,u=void 0===a?[]:a,c=t.content,l=void 0===c?"":c,d=t.title,f=void 0===d?"":d;if(null!==l&&(this.wrapper=null===this.wrapper?i.load("wrapper"):this.wrapper,this.dialog=null===this.dialog?i.load("dialog"):this.dialog,this.button=null===this.button?i.load("button"):this.button,null!==this.wrapper&&null!==this.dialog&&null!==this.button)){var h=function(){var t=s(),n="",o=u.map(function(o){var r=s();return o.close=void 0===o.close||o.close,e.button.reset(),e.button.hooks.id(r),e.button.hooks.caption(o.caption),n+=e.button.html,{id:r,callback:function(t,e,n){"function"==typeof e&&e(),n&&this.close(t)}.bind(e,t,o.callback,o.close)}});return e.dialog.reset(),e.wrapper.reset(),e.dialog.hooks.title(f).buttons(n).content(l),e.wrapper.hooks.id(t).content(e.dialog.html),e.wrapper.mount(r),o.forEach(function(e){_node('div[id="'+t+'"] a[id="'+e.id+'"]').events().add("click",e.callback)}),{v:t}}();if("object"===("undefined"==typeof h?"undefined":o(h)))return h.v}return!1}},{key:"close",value:function(t){var e=_node('div[id="'+t+'"]').target;null!==e&&e.parentNode.removeChild(e)}}]),t}();t.exports=new a},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),r=e(7),i=e(6),s=function(){function t(){n(this,t),this.pattern=null}return o(t,[{key:"show",value:function(t){var e=t.parent,n=void 0===e?document.body:e,o=t.caption,s=void 0===o?"":o;if(this.pattern=null===this.pattern?r.load("progress"):this.pattern,null!==this.pattern){var a=i();return this.pattern.reset(),this.pattern.hooks.id(a).caption(s),this.pattern.mount(n),a}return!1}},{key:"close",value:function(t){var e=_node('div[id="'+t+'"]').target;null!==e&&e.parentNode.removeChild(e)}}]),t}();t.exports=new s},function(t,exports,e){"use strict";"strict mode";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),r=e(2),i=function(){function t(e){if(n(this,t),void 0===window.FileReader)throw new Error("Browser does not support fs API.");if("undefined"==typeof e)throw new Error("File should be defined.");this.file=e}return o(t,[{key:"load",value:function(t){var e=new FileReader;r.add(e,"load",function(n){e=null,void 0!==n.target&&void 0!==n.target.result?"function"==typeof t&&t(n.target.result,void 0):"function"==typeof t&&t(void 0,n)}),r.add(e,"error",function(n){e=null,"function"==typeof t&&t(void 0,n)}),e.readAsText(this.file)}}]),t}();t.exports=i},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),i=e(7),s=e(6),a=function(){function t(){n(this,t),this.property=null,this.sub=null,this.results=null}return r(t,[{key:"getPropHTML",value:function(t,e){var n="";if(e instanceof Array){var r="",i=s();e.forEach(function(t,e){r+=this.getPropHTML(e,t)}.bind(this)),this.property.reset(),this.sub.reset(),this.sub.hooks.id[0](i).id[1](i).list(r),this.property.hooks.name('"'+t+'"').value(""),n+=this.property.html,n+=this.sub.html}else if("object"===("undefined"==typeof e?"undefined":o(e))&&null!==e){var a="",u=s();_object(e).forEach(function(t,e){a+=this.getPropHTML(t,e)}.bind(this)),this.property.reset(),this.sub.reset(),this.sub.hooks.id[0](u).id[1](u).list(a),this.property.hooks.name('"'+t+'"').value(""),n+=this.property.html,n+=this.sub.html}else this.property.reset(),this.property.hooks.name('"'+t+'" :').value(("string"==typeof e?'"':"")+(void 0!==e.toString?e.toString():"Parsing error...")+("string"==typeof e?'"':"")).type("undefined"==typeof e?"undefined":o(e)),n+=this.property.html;return n}},{key:"render",value:function(t){var e=t.parent,n=void 0===e?document.body:e,r=t.data,a=void 0===r?null:r,u=t.callback;return null!==a&&(this.property=null===this.property?i.load("property"):this.property,this.sub=null===this.sub?i.load("property-sub"):this.sub,this.results=null===this.results?i.load("json-results"):this.results,setTimeout(function(){var t=s(),e=function(){var t=this,e="";return a instanceof Array?a.forEach(function(n,o){e+=t.getPropHTML(o,n)}):"object"===("undefined"==typeof a?"undefined":o(a))&&null!==a?_object(a).forEach(function(n,o){e+=t.getPropHTML(n,o)}):e=a.toString(),e}.bind(this)();this.results.reset(),this.results.hooks.content(e).id(t),this.results.mount(n),"function"==typeof u&&u(t)}.bind(this),1),!0)}},{key:"close",value:function(t){var e=_node('div[id="'+t+'"]').target;null!==e&&e.parentNode.removeChild(e)}}]),t}();t.exports=a},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),i=e(7),s=e(6),a=function(){function t(e,o){n(this,t),this.section=i.load("section"),this.id=s(),this.data=e,this.refs={parent:null,count:null,memory:null,marker:null},this.mem=0,this.placeholder=o}return r(t,[{key:"get",value:function(){return this.section.reset(),this.section.hooks.id(this.id).name(this.data.info.name).memType(this.data.info.memType),this.section.html}},{key:"getRefs",value:function(){return null===this.refs.parent&&(this.refs.parent=_node('*[id="'+this.id+'"]').target),null===this.refs.count&&(this.refs.count=_node('*[id="'+this.id+'"] span.count').target),null===this.refs.memory&&(this.refs.memory=_node('*[id="'+this.id+'"] span.memory').target),null===this.refs.marker&&(this.refs.marker=_node('*[id="'+this.id+'"] span.marker').target),null!==this.refs.count&&(null!==this.refs.memory&&null!==this.refs.marker)}},{key:"memUpdate",value:function(){var t=this;return this.mem=0,this.data.childs.forEach(function(e){t.mem+=e.size}),0===this.mem&&null!==this.refs.parent?!~this.refs.parent.className.indexOf("inactive")&&(this.refs.parent.className+=" inactive"):this.refs.parent.className=this.refs.parent.className.replace(" inactive",""),this.mem}},{key:"update",value:function(){this.getRefs()&&(this.refs.count.innerHTML=Object.keys(this.data.childs).length,this.refs.memory.innerHTML=this.memUpdate())}},{key:"memory",value:function(t){this.getRefs()&&(this.refs.marker.style.width=this.mem/t*100+"%")}},{key:"init",value:function(){var t=this;this.getRefs()&&_node(this.refs.parent).events().add("click",function(n){var o=e(9),r=e(11),i=o.show({caption:"please, wait..."}),s=new r,a=_node(t.placeholder).target;a.innerHTML="",setTimeout(function(){s.render({parent:a,data:function(){var t={};return this.data.childs.forEach(function(e){t[e.processName]=e}),t}.bind(t)(),callback:function(){o.close(i)}})},50)})}}]),t}(),u=function(){function t(e){n(this,t),this.wrapper=i.load("map"),this.data=e,this.structured=null,this.sections=[],this.memory=[],this.id=s(),this.mem={total:0},this.refs={processes:null},this.shakeTimer=null}return r(t,[{key:"getStructure",value:function(){function t(e,n){var r=[];return"object"===("undefined"==typeof e?"undefined":o(e))&&null!==e&&(void 0===e.section?Object.keys(e).forEach(function(i){"object"===o(e[i])&&null!==e[i]&&(void 0!==e[i].section&&e[i].section===n?(e[i].processName=i,r.push(e[i])):r=r.concat(t(e[i],n)))}):e.section===n&&(e[key].processName=key,r.push(e))),r}var e=this,n={},r={},i=[];void 0!==this.data.sections&&void 0!==this.data.symbols&&(Object.keys(this.data.sections).forEach(function(o){var r=e.data.sections[o].name;n[r]={},n[r].info=e.data.sections[r],n[r].childs=t(e.data.symbols,o),i=i.concat(n[r].childs)}),Object.keys(this.data.sections).forEach(function(t){void 0===r[e.data.sections[t].memType]&&(r[e.data.sections[t].memType]={}),r[e.data.sections[t].memType].info={memType:e.data.sections[t].memType,size:0},void 0===r[e.data.sections[t].memType].childs&&(r[e.data.sections[t].memType].childs=[]),r[e.data.sections[t].memType].childs=r[e.data.sections[t].memType].childs.concat(n[t].childs)})),this.structured={sections:n,memory:r,all:i}}},{key:"memUpdate",value:function(){var t=this;this.mem={total:0},this.structured.all.forEach(function(e){void 0!==e.memType&&(t.mem[e.memType]=void 0===t.mem[e.memType]?0:t.mem[e.memType]),void 0!==e.size&&(t.mem.total+=e.size),void 0!==e.size&&(t.mem[e.memType]+=e.size)})}},{key:"render",value:function(t){var e=this,n=t.parent,o=void 0===n?document.body:n,r=t.callback;setTimeout(function(){var t='*[id="'+e.id+'"] div.processes';e.getStructure(),_object(e.structured.sections).forEach(function(n,o){e.sections.push(new a(o,t))}),_object(e.structured.memory).forEach(function(n,o){e.memory.push(new a(o,t))}),e.wrapper.hooks.id(e.id).sections(function(){var t="";return this.sections.forEach(function(e){t+=e.get()}),t}.bind(e)()).memories(function(){var t="";return this.memory.forEach(function(e){t+=e.get()}),t}.bind(e)()),e.wrapper.mount(o),e.init(),e.update(),e.shakeAttach(),"function"==typeof r&&r()},50)}},{key:"bind",value:function(){var t=this;this.structured.all.forEach(function(e){_object(e).bind("size",function(e,n,o){t.update()})})}},{key:"shake",value:function(){var t=this,e=this.structured.all[Math.floor((this.structured.all.length-1)*Math.random())];e.size+=Math.floor(("ram"===e.memType?5e5:5e3)*Math.random()),this.shakeTimer=setTimeout(function(){t.shake()},100)}},{key:"shakeAttach",value:function(){_node('div[id="'+this.id+'"] a.shake').events().add("click",this.shakeTrigger.bind(this))}},{key:"shakeTrigger",value:function(t){function e(t){_node('div[id="'+this.id+'"] a.shake span').target.innerHTML=t}null===this.shakeTimer?(this.shake(),e.call(this,"OFF")):(clearTimeout(this.shakeTimer),this.shakeTimer=null,e.call(this,"ON"))}},{key:"init",value:function(){this.sections.forEach(function(t){t.init()}),this.memory.forEach(function(t){t.init()}),this.bind()}},{key:"update",value:function(){var t=this;this.memUpdate(),this.sections.forEach(function(e){e.update(),e.memory(t.mem.total)}),this.memory.forEach(function(e){e.update(),e.memory(t.mem.total)})}},{key:"close",value:function(){var t=_node('div[id="'+this.id+'"]').target;null!==t&&t.parentNode.removeChild(t)}}]),t}();t.exports=u},function(t,exports,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),i=e(2),s=e(6),a=null,u=function(){function t(e,o,r,i,s){n(this,t),this.settings=s,this.url=e,this.method=o,this.parameters=r,this.callbacks=i,this.response=null,this.responseHeaders=null,this.httpRequest=null}return r(t,[{key:"send",value:function(){try{if(a.requests.add(this),this.httpRequest=new XMLHttpRequest,null!==this.httpRequest){switch(i.add(this.httpRequest,"readystatechange",this.readystatechange.bind(this)),i.add(this.httpRequest,"timeout",this.timeout.bind(this)),this.httpRequest.timeout=this.settings.timeout,this.callback(this.callbacks.before),this.method){case a.settings.methods.POST:this.httpRequest.open(this.method,this.url,!0),this.setHeaders(),this.httpRequest.send(this.parameters._parameters);break;case a.settings.methods.GET:this.httpRequest.open(this.method,this.url+(""!==this.parameters._parameters?"?":"")+this.parameters._parameters,!0),this.setHeaders(),this.httpRequest.send();break;default:this.httpRequest.open(this.method,this.url,!0),this.setHeaders(),this.httpRequest.send(this.parameters._parameters)}return!0}throw new Error("Fail create XMLHttpRequest")}catch(t){this.callback(this.callbacks.fail,t),this.destroy()}}},{key:"setHeaders",value:function(){if(null!==this.settings.headers)for(var t in this.settings.headers)this.httpRequest.setRequestHeader(t,this.settings.headers[t])}},{key:"readystatechange",value:function(t){if(a.requests.isConflict(this.settings.id)!==!1&&t.target&&t.target.readyState)switch(this.callback(this.callbacks.reaction,t),t.target.readyState){case 2:this.responseHeaders=this.parseHeaders(t.target.getAllResponseHeaders()),this.callback(this.callbacks.headers,t);break;case 4:return 200===t.target.status?(this.response=this.parse(t.target.responseText),this.destroy(),this.callback(this.callbacks.success,t),!0):(this.destroy(),this.callback(this.callbacks.fail,t),!1)}}},{key:"timeout",value:function(t){a.requests.isConflict(this.settings.id)!==!1&&(this.callback(this.callbacks.timeout,t),this.destroy())}},{key:"parse",value:function(t){var e={original:t,parsed:void 0};try{e.parsed=JSON.parse(t)}catch(t){}finally{return e}}},{key:"parseHeaders",value:function(t){var e={_headers:t,headers:{}},n=null;return"string"==typeof t&&(n=t.split("\r\n"),n instanceof Array&&n.forEach(function(t){var n=t.split(":");n instanceof Array&&""!==n[0]&&(e.headers[n[0]]=t.replace(n[0]+":",""))})),e}},{key:"callback",value:function(t,e){null!==t&&t(this.response,{id:this.id,event:void 0!==e?e:null,headers:this.responseHeaders,response:this.response,parameters:this.parameters,url:this.url,abort:this.abort.bind(this)})}},{key:"abort",value:function(){null!==this.httpRequest&&"function"==typeof this.httpRequest.abort&&this.httpRequest.abort()}},{key:"destroy",value:function(){a.requests.remove(this)}}]),t}(),a={settings:{DEFAULT_TIMEOUT:15e3,DEFAULT_METHOD:"GET",methods:{POST:"POST",GET:"GET",PUT:"PUT",DELETE:"DELETE",OPTIONS:"OPTIONS"},regs:{URLENCODED:/-urlencoded/gi,JSON:/application\/json/gi},headers:{CONTENT_TYPE:"Content-Type",ACCEPT:"Accept"}},requests:{storage:{},add:function(t){var e=a.requests.storage;return void 0===e[t.settings.id]&&(e[t.settings.id]=t,!0)},remove:function(t){var e=a.requests.storage;return void 0!==e[t.settings.id]&&(e[t.settings.id]=null,delete e[t.settings.id],!0)},isConflict:function(t){return void 0!==a.requests.storage[t]}},create:function(t,e,n,o,r){return t="string"==typeof t?t:null,e="string"==typeof e&&[a.settings.methods.POST,a.settings.methods.GET,a.settings.methods.PUT,a.settings.methods.DELETE,a.settings.methods.OPTIONS].indexOf(e.toUpperCase())!==-1?e.toUpperCase():a.settings.DEFAULT_METHOD,r=a.parse.settings(r),n=a.parse.parameters(n,r),o=a.parse.callbacks(o),null!==t?new u(t,e,n,o,r):null},parse:{settings:function t(t){var t="object"===("undefined"==typeof t?"undefined":o(t))&&null!==t?t:{};return t.id="string"==typeof t.id?t.id:"number"==typeof t.id?t.id:s(),t.id=a.requests.isConflict(t.id)===!1?t.id:s(),t.timeout="number"==typeof t.timeout?t.timeout:a.settings.DEFAULT_TIMEOUT,t.doNotChangeHeaders="boolean"==typeof t.doNotChangeHeaders&&t.doNotChangeHeaders,t.doNotChangeParameters="boolean"==typeof t.doNotChangeParameters&&t.doNotChangeParameters,t.doNotEncodeParametersAsURL="boolean"==typeof t.doNotEncodeParametersAsURL&&t.doNotEncodeParametersAsURL,t.headers=a.parse.headers(t),t},parameters:function t(e,n){var t=e,r={},i="",s=[],u=null;if(n.doNotChangeParameters)i=e;else{if(t instanceof Array)Array.prototype.forEach.call(t,function(e,n){var o=null;t[n]=param.replace(/^\s*\?/gi,""),o=t[n].split("="),o instanceof Array&&2===o.length?r[o[0]]=o[1]:s.push(t[n])});else if("object"===("undefined"==typeof t?"undefined":o(t))&&null!==t)for(var c in t){switch(o(t[c])){case"string":r[c]=t[c];break;case"boolean":r[c]=t[c].toString();break;case"number":r[c]=t[c].toString();break;case"object":r[c]=JSON.stringify(t[c]);break;default:try{r[c]=JSON.stringify(t[c])}catch(t){}}r[c]=r[c]}if("string"!=typeof e)if(a.settings.regs.JSON.lastIndex=0,a.settings.regs.URLENCODED.lastIndex=0,a.settings.regs.JSON.test(n.headers[a.settings.headers.CONTENT_TYPE]))i=JSON.stringify(r);else{u=a.settings.regs.URLENCODED.test(n.headers[a.settings.headers.CONTENT_TYPE]),u=!n.doNotEncodeParametersAsURL&&u;for(var c in r)i+="&"+c+"="+(u?encodeURIComponent(r[c]):r[c]);i=i.replace(/^\s*\&/gi,"")}else i=e}return{original:e,parameters:r,_parameters:i,excluded:s}},callbacks:function t(e){var t={};return"object"===("undefined"==typeof e?"undefined":o(e))&&null!==e&&(t.before="function"==typeof e.before?e.before:null,t.success="function"==typeof e.success?e.success:null,t.fail="function"==typeof e.fail?e.fail:null,
t.reaction="function"==typeof e.reaction?e.reaction:null,t.timeout="function"==typeof e.timeout?e.timeout:null,t.headers="function"==typeof e.headers?e.headers:null),t},headers:function(t){var e={};return t.doNotChangeHeaders?e="object"===o(t.headers)&&null!==t.headers?t.headers:{}:("object"===o(t.headers)&&null!==t.headers&&oop.objects.forEach(t.headers,function(t,n){var o=t.split("-");o.forEach(function(t,e){o[e]=t.charAt(0).toUpperCase()+t.slice(1)}),e[o.join("-")]=n}),void 0===e[a.settings.headers.CONTENT_TYPE]&&(e[a.settings.headers.CONTENT_TYPE]="application/x-www-form-urlencoded"),void 0===e[a.settings.headers.ACCEPT]&&(e[a.settings.headers.ACCEPT]="*/*")),t.headers=e,t.headers}}};t.exports=a.create}]);
//# sourceMappingURL=app.js.map