var EventDispatcher = createjs.EventDispatcher,
    EaselEvent = createjs.Event;

var c = createjs;

var width, height, hud,
    isDirty = false,
    texts = {},
    values = {
        health : 100,
        score : 0
    };

hudService = {
    init : hudInit,
    get : hudGet
};

function hudInit(x, y) {
    EventDispatcher.initialize(hudService);

    width = x;
    height = y;
    hud = createHud();

    hud.on('tick', onTick);
    hud.on('update', onUpdate);
    hud.on('set', onSet);
}

function createHud() {
    var newHud = new c.Container(0, 0);

    var header = new c.Text('SPACE SHOOTER', '16px Arial', '#CCC');
    header.x = width/2 - header.getMeasuredWidth()/2;
    header.y = 8;
    newHud.addChild(header);

    var scoreLabel = new c.Text('SCORE', '16px Arial', '#CCC');
    scoreLabel.x = width - scoreLabel.getMeasuredWidth() - 20;
    scoreLabel.y = 8;
    newHud.addChild(scoreLabel);

    var healthLabel = new c.Text('HEALTH', '16px Arial', '#CCC');
    healthLabel.x = 20;
    healthLabel.y = 8;
    newHud.addChild(healthLabel);

    texts.score = new c.Text(values.score, '16px Arial', '#CCC');
    texts.score.textAlign = 'right';
    texts.score.x = width - texts.score.getMeasuredWidth() - 12;
    texts.score.y = 24;
    newHud.addChild(texts.score);

    texts.health = new c.Text(values.health, '16px Arial', '#CCC');
    texts.health.x = 20;
    texts.health.y = 24;
    newHud.addChild(texts.health);

    return newHud;
}

function hudGet() {
    return hud;
}

function onTick() {
    if(isDirty) {
        for(var key in values) {
            if(values.hasOwnProperty(key)) {
                textObj = texts[key];
                if(textObj) textObj.texst = values[key];
            }
        }
    }
    isDirty = false;
}

function onUpdate(event) {
    if(!event.data) return;

    var property = event.data.property;
    var value = event.data.value;

    if(property && value) {
        values[property] += value;
        isDirty = true;
    }
}

function onSet(event) {
    if(!event.data) return;

    var property = event.data.property;
    var value = event.data.value;

    if(property && value) {
        values[property] = value;
        isDirty = true;
    }
}

module.exports = hudService;