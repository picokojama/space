var Container = createjs.Container,
    collisionService = require('./collisions'),
    hud = require('./hud');

function Meteor(x, y) {
    this.Container_constructor();

    this.name = 'Meteor';
    this.x = x;
    this.y = y;
    this.rotation = Math.random() * 360;
    this.direction = Math.random() * 360;
    this.velocity = Math.random() * 8 + 2;
    this.speedX = Math.sin(this.direction * Math.PI / -180);
    this.speedY = Math.cos(this.direction * Math.PI / -180);

    this.body = new createjs.Bitmap('img/meteor.png');
    this.body.x = -49;
    this.body.y = -48;
    this.addChild(this.body);

    collisionService.addActor(this, 'circle', {radius : 48});

    this.on('collision', onCollision);
    this.on('tick', onTick);
}

function onCollision(event) {
    var other = event.data.other;
    if(other.name == 'Hero' || other.name == 'Laser') {
        hud.dispatchEvent({
            type : 'update',
            data : {property : 'score', value: 10}
        });
        collisionService.removeActor(this);
        this.parent.removeChild(this);
    }
}

function onTick() {
    this.x += this.speedX * this.velocity;
    this.y += this.speedY * this.velocity;
}

p = createjs.extend(Meteor, Container);

ret = createjs.promote(Meteor, "Container");

module.exports = ret;