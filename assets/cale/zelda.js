var PIXI = require('pixi.js');
var keyboard = require('./util/keyboard');
var attachKeyHandlers = require('./util/keyHandlers');
var linkUpdate = require('./util/linkUpdate');
var actions = require('./util/actions');
var linkSpriteFactory = require('./util/linkSpriteFactory');
var deserializeFromServer = require('./util/deserializer');

var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(720, 720);
document.body.appendChild(renderer.view);

var link, map, state;
var otherLinks = [];

PIXI.loader
    .add(['cale/images/kakariko.png', 'cale/images/links.json'])
    .load(setup);

function setup() {
  map = new PIXI.Sprite(
    PIXI.loader.resources['cale/images/kakariko.png'].texture
  );
  map.x = -720;
  map.y = -720;

  var linkTextures = PIXI.loader.resources['cale/images/links.json'].textures;
  var socket = require('./util/socket').createSocket(otherLinks, stage, linkTextures);

  link = linkSpriteFactory(0, 0, linkTextures);

  stage.scale = new PIXI.Point(2, 2);
  stage.addChild(map);
  stage.addChild(link);

  attachKeyHandlers(socket, link);
  state = update;

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  state();

  renderer.render(stage);
}

function update() {
  linkUpdate.updateOwnLink(link, map);

  otherLinks.forEach(function(link) {
    if (link.sprite) {
      linkUpdate.updateOtherLink(link.sprite);
    }
  });
}

setInterval(() => {
  otherLinks.forEach(function(link) {
    if (link.sprite) {
      link.sprite.x = parseFloat(link.x);
      link.sprite.y = parseFloat(link.y);
    }
  });
}, 200);
