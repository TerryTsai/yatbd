var keyboard = require('./keyboard');
var actions = require('./actions');

var sendSocketUpdate = function(socket, action, direction, link) {
  var csvString = ['s', action, direction, link.x, link.y, link.mapX, link.mapY];
  socket.send(csvString.join(','));
};

module.exports = function(socket, link) {
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  var leftInterval, rightInterval, downInterval, upInterval;
  left.press = function() {
    actions.walkLeft(link);
    leftInterval = setInterval(() => {
      sendSocketUpdate(socket, 'MOVE', 'left', link);
    }, 200);
  };
  left.release = function() {
    clearInterval(leftInterval);
    if (!right.isDown) {
      actions.standLeft(link);
      sendSocketUpdate(socket, 'STAND', 'left', link);
    }
  };

  up.press = function() {
    actions.walkUp(link);
    upInterval = setInterval(() => {
      sendSocketUpdate(socket, 'MOVE', 'up', link);
    }, 200);
  };
  up.release = function() {
    clearInterval(upInterval);
    if (!down.isDown && link.vx === 0) {
      actions.standUp(link);
      sendSocketUpdate(socket, 'STAND', 'up', link);
    }
  };

  right.press = function() {
    actions.walkRight(link);
    rightInterval = setInterval(() => {
      sendSocketUpdate(socket, 'MOVE', 'right', link);
    }, 200);
  };
  right.release = function() {
    clearInterval(rightInterval);
    if (!left.isDown && link.vy === 0) {
      actions.standRight(link);
      sendSocketUpdate(socket, 'STAND', 'right', link);
    }
  };

  down.press = function() {
    actions.walkDown(link);
    downInterval = setInterval(() => {
      sendSocketUpdate(socket, 'MOVE', 'down', link);
    }, 200);
  };
  down.release = function() {
    clearInterval(downInterval);
    if (!up.isDown && link.vx === 0) {
      actions.standDown(link);
      sendSocketUpdate(socket, 'STAND', 'down', link);
    }
  };
};
