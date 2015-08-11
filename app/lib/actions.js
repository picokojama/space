var EventDispatcher = createjs.EventDispatcher
    , EaselEvent = createjs.Event
    , stage;

var controls = {
    37: 'moveleft',
    39: 'moveright',
    38: 'moveup',
    40: 'movedown',
    32: 'fire1'
};

var currentActions = {};


var actionService = {
    init: actions_init,
    get: actions_get
};


function actions_init(win, current_stage) {
    stage = current_stage;
    EventDispatcher.initialize(actionService);

    win.addEventListener('keydown', onKeyDown);
    win.addEventListener('keyup', onKeyUp);
    win.addEventListener('mousemove', onmousemove);
}


function actions_get() {
    return currentActions;
}

function onmousemove(event) {
    var canvasEl = stage.canvas;
    var canvasXPos = canvasEl.offsetLeft;
    var canvasYPos = canvasEl.offsetTop;

    currentActions.mouse = {
        winx : event.clientX,
        winY : event.clientY,
        stageX : event.clientX - canvasXPos,
        stageY : event.clientY - canvasYPos,
        target : event.target
    };
}

function onKeyDown(event) {
    var keyEvent = processEvent(event, 'down');
    if (keyEvent) {
        currentActions[keyEvent.type] = keyEvent.data;
    }
}

function onKeyUp(event) {
    var keyEvent = processEvent(event, 'up');
    if (keyEvent)
        delete currentActions[keyEvent.type];
}


function processEvent(event, phase) {
    var generalEvent = prepareEvent(event, phase, 'key');
    if (!generalEvent) return;
    var specificEvent = prepareEvent(event, phase);

    actionService.dispatchEvent(generalEvent);
    actionService.dispatchEvent(specificEvent);

    return specificEvent;
}


function prepareEvent(event, phase, type) {
    var actionName = controls[event.keyCode];
    if (!actionName) return;

    type = type || actionName;

    var eventData = {
        name: actionName,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        phase: phase
    };

    var keyEvent = new EaselEvent(type);
    keyEvent.data = eventData;
    keyEvent.nativeEvent = event;
    return keyEvent;
}

module.exports = actionService;