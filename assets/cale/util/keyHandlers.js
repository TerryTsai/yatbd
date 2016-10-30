var keyboard = require('./keyboard');
var actions = require('./actions');

var sendSocketUpdate = function(socket, action, direction, link) {
  var csvString = ['s', action, direction, link.x, link.y, link.mapX, link.mapY];
  socket.send(csvString.join(','));
};

module.exports = function(socket, link) {
  var left = keyboard(37);
  var up = keyboard(38);
  var right = keyboard(39);
  var down = keyboard(40);
  var space = keyboard(32);

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

  space.press = function() {
    switch(link.direction) {
      case 'up':
        sendSocketUpdate(socket, 'SWING_SWORD', 'up', link);
        actions.swingSwordUp(link, function() {
          sendSocketUpdate(socket, 'STAND', 'up', link);
        });
        break;
      case 'down':
        sendSocketUpdate(socket, 'SWING_SWORD', 'down', link);
        actions.swingSwordDown(link, function() {
          sendSocketUpdate(socket, 'STAND', 'down', link);
        });
        break;
      case 'left':
        sendSocketUpdate(socket, 'SWING_SWORD', 'left', link);
        actions.swingSwordLeft(link, function() {
          sendSocketUpdate(socket, 'STAND', 'left', link);
        });
        break;
      case 'right':
        sendSocketUpdate(socket, 'SWING_SWORD', 'right', link);
        actions.swingSwordRight(link, function() {
          sendSocketUpdate(socket, 'STAND', 'right', link);
        });
        break;
    }
  };
  space.release = function() {};

  var changeScreenHandler = function() {
    [up, down, left, right].forEach(key => {
      if (key.isDown) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
    });
    link.vx = 0;
    link.vy = 0;
  };

  document.addEventListener('visibilitychange', changeScreenHandler);
  window.onblur = function() {
    changeScreenHandler();
  };
};
