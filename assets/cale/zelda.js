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

var myId, link, map, state, linkTextures;
var otherLinks = [];
var socket = new WebSocket('ws://' + window.location.host + '/zeldaws');

socket.onclose = function() {
  console.log('closed');
};

socket.onmessage = function (event) {
  if (!myId) {
    myId = event.data.split(',')[0];
    return;
  }

  var linksById = deserializeFromServer(event.data, myId);

  Object.keys(linksById).forEach(id => {
    var otherLinkIndex = otherLinks.findIndex(e => e.id === id);

    if(otherLinkIndex === -1) {
      otherLinks.push(linksById[id]);
    } else {
      var oldLink = otherLinks[otherLinkIndex];
      oldLink = Object.assign(oldLink, linksById[id]);
    }
  });

  if (!linkTextures) {
    return;
  }
  otherLinks.forEach(function(link) {
    if (link.sprite) {
      switch(link.direction) {
        case 'up':
          return link.action === 'MOVE' ? actions.walkUp(link.sprite) : actions.standUp(link.sprite);
        case 'down':
          return link.action === 'MOVE' ? actions.walkDown(link.sprite) : actions.standDown(link.sprite);
        case 'left':
          return link.action === 'MOVE' ? actions.walkLeft(link.sprite) : actions.standLeft(link.sprite);
        case 'right':
          return link.action === 'MOVE' ? actions.walkRight(link.sprite) : actions.standRight(link.sprite);
      }
    } else {
      var sprite = linkSpriteFactory(parseFloat(link.x), parseFloat(link.y), linkTextures);
      link.sprite = sprite;
      stage.addChild(sprite);
    }
  });
};

PIXI.loader
    .add(['cale/images/kakariko.png', 'cale/images/links.json'])
    .load(setup);

function setup() {
  map = new PIXI.Sprite(
    PIXI.loader.resources['cale/images/kakariko.png'].texture
  );
  map.x = -720;
  map.y = -720;

  linkTextures = PIXI.loader.resources['cale/images/links.json'].textures;

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
  linkUpdate.updateOwnLink(link);

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
