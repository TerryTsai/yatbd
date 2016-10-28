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
      var sprite = createLink(parseFloat(link.x), parseFloat(link.y), linkTextures);
      sprite.show(3);
      sprite.fps = 20;
      link.sprite = sprite;
      stage.addChild(sprite);
    }
  });
};

module.exports = socket;
