var actions = require('./actions');
var deserializeFromServer = require('./deserializer');
var linkSpriteFactory = require('./linkSpriteFactory');
var otherLinkUtil = require('./otherLinks');

var socket, myId;

var otherLinks = {};

exports.createSocket = function(stage, linkTextures) {
  socket = new WebSocket('ws://' + window.location.host + '/zeldaws');

  socket.onclose = function() {
    console.log('the socket was closed');
  };

  socket.onmessage = function (event) {
    if (!myId) {
      myId = event.data.split(',')[0];
      return;
    }

    var newLinks = deserializeFromServer(event.data, myId);
    otherLinks = otherLinkUtil.updateLinks(otherLinks, newLinks, stage);

    otherLinkUtil.getAll(otherLinks).forEach(function(link) {
      if (link.sprite) {
        link.sprite.x = parseFloat(link.x);
        link.sprite.y = parseFloat(link.y);
        link.sprite.mapX = parseInt(link.mapX);
        link.sprite.mapY = parseInt(link.mapY);
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
        link.sprite = linkSpriteFactory(parseFloat(link.x), parseFloat(link.y), linkTextures);
        stage.addChild(link.sprite);
      }
    });
  };

  return socket;
};

exports.socket = socket;
exports.getOtherLinks = function() {
  return otherLinks;
};
