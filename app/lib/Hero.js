var actionService = require('./actions')
    , Container = createjs.Container
    , collisionService = require('./collisions')
    , Laser = require('./Laser')
    , hud = require('./hud');

var keyActions = {
    'moveleft' : {property : 'heading', value : -1},
    'moveright' : {property : 'heading', value : 1},
    'moveup' : {property : 'thrust', value : -1},
    'movedown' : {property : 'thrust', value : 0.5},
    'fire1' : {property : 'fireing', value : true}
};

var BRZINA = 3,
    ROT_BRZINA = 3.8,
    TROMOST = 0.88,
    MOMENT_TROMOSTI = 0.8;


function Hero(x, y) {
    this.Container_constructor();
    this.x = x;
    this.y = y;

    prepare_properties.call(this);
    prepare_body.call(this);

    collisionService.addActor(this, 'circle', {radius : 40});

    this.on('tick', onTick);
    this.on('collision', onCollision);
}

p = createjs.extend(Hero, Container);

ret = createjs.promote(Hero, "Container");

function onCollision(event) {
    var other = event.data.other;
    if(other.name == 'Meteor') {
        this.takeDemage(20);
    }
}

Hero.prototype.takeDemage = function(demage) {
    this.alpha = 0.5;
    this.health -= demage;
    console.log('Health je', this.health);

    hud.dispatchEvent({
        type : 'set',
        data : {property : 'health', value : this.health}
    });

    var self = this;
    setTimeout(function() {
        self.alpha = 1;
    }, 2000);
};

function onTick(event) {
    this.rotation += this.vRot * ROT_BRZINA;
    this.y += this.vY;
    this.x += this.vX;

    var actions = process_actions.call(this);
    processActionAnimation.call(this, actions);

    if(this.fireing) {
        fireWepon.call(this);
    }
    this.fireing = false;

    this.vRot += this.heading;
    this.vRot = this.vRot * MOMENT_TROMOSTI;

    var ratioX = Math.sin((this.rotation) * Math.PI / -180) * this.thrust;
    var ratioY = Math.cos((this.rotation) * Math.PI / -180) * this.thrust;
    var diffX = ratioX * BRZINA;
    var diffY = ratioY * BRZINA;

    this.vX += diffX;
    this.vY += diffY;

    this.vX = this.vX * TROMOST;
    this.vY = this.vY * TROMOST;

    //mouse_look.call(this);
}

function fireWepon() {
    laser = new Laser(this.x, this.y, this.rotation);
    var index = this.parent.getChildIndex(this);
    this.parent.addChildAt(laser, index);
}

function processActionAnimation(actions) {
    var flames = this.flames;

    if(actions.moveup && !flames.playing) {
        flames.playing = true;
        flames.gotoAndPlay('start');
    } else if (!actions.moveup && !actions.movedown && flames.playing) {
        flames.playing = false;
        flames.gotoAndPlay('end');
    }
}

function prepare_body() {
    this.body = new createjs.Bitmap('img/hero.png');
    this.body.x = -50;
    this.body.y = -37;
    this.addChild(this.body);

    var data = {
        images : ['img/fire.png'],
        frames : {
            width : 128,
            height : 126,
            regX : 64,
            regY : 63
        },
        animations : {
            start: [0, 8, 'go'],
            go : [8, 21],
            end : [22, 29, 'off'],
            off : [29]
        }
    };

    var spriteSheet = new createjs.SpriteSheet(data);
    var flames = new createjs.Sprite(spriteSheet, 'start');
    flames.x = 0;
    flames.y = 88;
    flames.rotation = 180;
    this.flames = flames;
    flames.gotoAndStop('start');
    this.addChild(flames);
}

function mouse_look() {
    var angle = Math.atan2(this.lookY - this.y, this.lookX - this.x) * 180 / Math.PI + 90;
    this.rotation = angle;
}

function prepare_properties() {
    this.name = 'Hero';
    this.thrust = 0;
    this.heading = 0;
    this.rotation = 0;
    this.vRot = 0;
    this.vX = 0;
    this.vY = 0;
    this.lookX = 0;
    this.lookY = 0;
    this.health = 100;
    this.fireing = false;
}

function process_actions() {
    var actions = actionService.get();
    this.thrust = 0;
    this.heading = 0;
    this.firing = false;

    for(var key in actions) {
        if(actions.hasOwnProperty(key)) {
            var keyAction = keyActions[key];
            if(keyAction) {
                this[keyAction.property] = keyAction.value;
            }
        }
    }

    if(actions.mouse) {
        this.lookX = actions.mouse.stageX;
        this.lookY = actions.mouse.stageY;
    }

    return actions;
}

module.exports = ret;