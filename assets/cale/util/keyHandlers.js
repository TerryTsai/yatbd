var keyboard = require('./keyboard');
var actions = require('./actions');

module.exports = function(socket, link) {
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  var leftInterval, rightInterval, downInterval, upInterval;
  left.press = function() {
    actions.walkLeft(link);
    leftInterval = setInterval(() => {
      socket.send('s,MOVE,left,' + link.x + ',' + link.y);
    }, 200);
  };
  left.release = function() {
    clearInterval(leftInterval);
    if (!right.isDown) {
      actions.standLeft(link);
      socket.send('s,STAND,left,' + link.x + ',' + link.y);
    }
  };

  up.press = function() {
    actions.walkUp(link);
    upInterval = setInterval(() => {
      socket.send('s,MOVE,up,' + link.x + ',' + link.y);
    }, 200);
  };
  up.release = function() {
    clearInterval(upInterval);
    if (!down.isDown && link.vx === 0) {
      actions.standUp(link);
      socket.send('s,STAND,up,' + link.x + ',' + link.y);
    }
  };

  right.press = function() {
    actions.walkRight(link);
    rightInterval = setInterval(() => {
      socket.send('s,MOVE,right,' + link.x + ',' + link.y);
    }, 200);
  };
  right.release = function() {
    clearInterval(rightInterval);
    if (!left.isDown && link.vy === 0) {
      actions.standRight(link);
      socket.send('s,STAND,right,' + link.x + ',' + link.y);
    }
  };

  down.press = function() {
    actions.walkDown(link);
    downInterval = setInterval(() => {
      socket.send('s,MOVE,down,' + link.x + ',' + link.y);
    }, 200);
  };
  down.release = function() {
    clearInterval(downInterval);
    if (!up.isDown && link.vx === 0) {
      actions.standDown(link);
      socket.send('s,STAND,down,' + link.x + ',' + link.y);
    }
  };
};
