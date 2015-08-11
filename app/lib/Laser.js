var Container = createjs.Container,
    collisionService = require('./collisions');

var BULLET_SPEED = 25,
    LIFETIME = 20;

function Laser(x, y, rotation) {
    this.Container_constructor();

    this.name = 'Laser';
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.lifetime = 0;
    this.speedX = Math.sin(rotation * Math.PI / -180);
    this.speedY = Math.cos(rotation * Math.PI / -180);

    this.body = new createjs.Bitmap('img/laser.png');
    this.body.x = -4;
    this.body.y = -2;
    this.addChild(this.body);

    collisionService.addActor(this, 'point');

    this.on('collision', onCollision);
    this.on('tick', onTick);
}

function onCollision(event) {
    var other = event.data.other;
    if(other.name != 'Hero') {
        collisionService.removeActor(this);
        this.parent.removeChild(this);
    }
}

function onTick(event) {
    this.lifetime ++;
    this.x -= this.speedX * BULLET_SPEED;
    this.y -= this.speedY * BULLET_SPEED;

    if(this.lifetime > LIFETIME) {
        collisionService.removeActor(this);
        this.parent.removeChild(this);
    }
}

Laser.prototype.destroy = function() {
    if(this.parent) {
        collisionService.removeActor(this);
        this.parent.removeChild(this);
    }
}

p = createjs.extend(Laser, Container);

ret = createjs.promote(Laser, "Container");

module.exports = ret;