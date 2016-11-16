"strict mode";
function EventCaller(element, eventName) {
    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }
    var oEvent          = null,
        eventType       = null,
        evt             = null,
        eventMatchers   = {
            'HTMLEvents'    : /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            'MouseEvents'   : /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
        },
        defaultOptions  = {
            type            : eventName,
            canBubble       :true,
            cancelable      :true,
            view            :element.ownerDocument.defaultView,
            detail          :1,
            screenX         :0,
            screenY         :0,
            clientX         :0,
            clientY         :0,
            pointerX        : 0,
            pointerY        : 0,
            ctrlKey         :false,
            altKey          :false,
            shiftKey        :false,
            metaKey         : false,
            button          : 0,
            relatedTarget   :null
        },
        options         = extend(defaultOptions, arguments[2] || {});
    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }
    if (!eventType){
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
    }
    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
            oEvent.initMouseEvent(
                options.type,       options.canBubble,  options.cancelable, options.view,
                options.detail,     options.screenX,    options.screenY,    options.clientX,
                options.clientY,    options.ctrlKey,    options.altKey,     options.shiftKey,
                options.metaKey,    options.button,     options.relatedTarget
            );
        }
        element.dispatchEvent(oEvent);
    } else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        evt             = document.createEventObject();
        oEvent          = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
};

//Attach to environment
(function () {
	let Environment = require('./environment.js');
	//_node
	Environment.define.node('events.emulate', function (type) {
		return EventCaller(this.target, type);
	});
	//_nodes
	Environment.define.nodes('events.emulate', function (type) {
		Array.prototype.forEach.call(this.target, function (target) {
			EventCaller(target, type);
		});
	});
}());

module.exports = EventCaller;