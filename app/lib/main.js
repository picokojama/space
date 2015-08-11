var actionsService = require('./actions'),
    Hero = require('./Hero'),
    Meteor = require('./Meteor'),
    levels = require('./levels'),
    collisionService = require('./collisions'),
    hud = require('./hud');

var c = createjs
    , hero
    , stage
    , W = 500
    , H = 700
    , xCentre = W / 2
    , yCentre = H / 2
    , wWidth = 2000
    , wHeight = 2000
    , world
    , currentLevel = 1;


$(function() {
    stage = new c.Stage('main');
    prepareWorld();
    hud.init(W, H);
    stage.addChild(hud.get());
    actionsService.init(window, stage);
    c.Ticker.addEventListener('tick', function() {
        cameraMove();
        updateBackground();
        collisionService.broadcastCollisions();
        stage.update();
    });
});


function prepareWorld() {
    world = new c.Container();
    world.x = 0;
    world.y = 0;
    stage.addChild(world);

    var level = levels[currentLevel];
    wHeight = level.data.length * level.cellHeight;
    wWidth = level.data[0].length * level.cellWidth;

    level.data.forEach(function(row, rowIndex) {
        row.forEach(function(cell, cellIndex) {
            if(cell) {
                var cellXOffset = cellIndex * level.cellWidth;
                var cellYOffset = rowIndex * level.cellHeight;

                cell.data.forEach(function(item) {
                    var C = item.objClass;
                    var args = [C].concat(item.args);
                    var inst = new (C.bind.apply(C, args));
                    inst.x = inst.x + cellXOffset;
                    inst.y = inst.y + cellYOffset;
                    if(C == Hero) {
                        hero = inst;
                    }
                    world.addChild(inst);
                });
            }
        });
    });
}

function updateBackground() {
    var canvas = stage.canvas;
    canvas.style.backgroundPositionX = world.x + 'px';
    canvas.style.backgroundPositionY = world.y + 'px';
}

function cameraMove() {
    if (wWidth > W) {
        if (hero.x < wWidth - xCentre && hero.x > xCentre)
            world.x = -hero.x + xCentre;
        else if (hero.x >= wWidth - xCentre)
            world.x = -(wWidth - W);
        else
            world.x = 0;
    }

    if (wHeight > H) {
        if (hero.y < wHeight - yCentre && hero.y > yCentre)
            world.y = -hero.y + yCentre;
        else if (hero.y >= wHeight - yCentre)
            world.y = -(wHeight - H);
        else
            world.y = 0;
    }
}