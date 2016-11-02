var PIXI = require('pixi.js');
var keyboard = require('./util/keyboard');
var attachKeyHandlers = require('./util/keyHandlers');
var linkUpdate = require('./util/linkUpdate');
var actions = require('./util/actions');
var linkSpriteFactory = require('./util/linkSpriteFactory');
var deserializeFromServer = require('./util/deserializer');
var getAll = require('./util/otherLinks').getAll;
var getOtherLinks = require('./util/socket').getOtherLinks;

var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(720, 720);
document.body.appendChild(renderer.view);

var link, map, state;

PIXI.loader
    .add(['cale/images/kakariko.png', 'cale/images/links.json'])
    .load(setup);

function setup() {
  map = new PIXI.Sprite(
    PIXI.loader.resources['cale/images/kakariko.png'].texture
  );
  map.x = 0;
  map.y = 0;

  var linkTextures = PIXI.loader.resources['cale/images/links.json'].textures;
  var socket = require('./util/socket').createSocket(stage, linkTextures);

  link = linkSpriteFactory(137, 0, linkTextures);

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

  getAll(getOtherLinks()).forEach(function(otherLink) {
    if (otherLink.sprite) {
      linkUpdate.updateOtherLink(otherLink.sprite, link);
    }
  });
}
