var sprite = {};

var swingSword = function(char, startFrame, endFrame, standFrame, fps, cb) {
  char.loop = false;
  char.fps = fps;
  char.playAnimation([startFrame, endFrame]);
  var waitInterval = setInterval(() => {
    if (char.currentFrame === endFrame) {
      clearInterval(waitInterval);
      char.loop = true;
      char.fps = 20;
      char.show(standFrame);
      if (cb) {
        cb();
      }
    }
  });
};

sprite.walkLeft = function(char) {
  char.direction = 'left';
  char.vx = -1.5;
  char.vy = 0;
  if (!char.animating) {
    char.playAnimation([21, 27]);
  }
};

sprite.standLeft = function(char) {
  if (char.vy === 0) {
    char.vx = 0;
    char.stopAnimation();
    char.show(24);
  }
};

sprite.swingSwordLeft = function(char, cb) {
  swingSword(char, 52, 60, 24, 33, cb);
};

sprite.walkUp = function(char) {
  char.direction = 'up';
  char.vy = -1.5;
  char.vx = 0;
  if (!char.animating) {
    char.playAnimation([7, 13]);
  }
};

sprite.standUp = function(char) {
  char.vy = 0;
  char.stopAnimation();
  char.show(10);
};

sprite.swingSwordUp = function(char, cb) {
  swingSword(char, 34, 43, 10, 33, cb);
};

sprite.walkRight = function(char) {
  char.direction = 'right';
  char.vx = 1.5;
  char.vy = 0;
  if (!char.animating) {
    char.playAnimation([14, 20]);
  }
};

sprite.standRight = function(char) {
  char.vx = 0;
  char.stopAnimation();
  char.show(17);
};

sprite.swingSwordRight = function(char, cb) {
  swingSword(char, 43, 52, 17, 33, cb);
};

sprite.walkDown = function(char) {
  char.direction = 'down';
  char.vy = 1.5;
  char.vx = 0;
  if (!char.animating) {
    char.playAnimation([0, 6]);
  }
};

sprite.standDown = function(char) {
  char.vy = 0;
  char.stopAnimation();
  char.show(3);
};

sprite.swingSwordDown = function(char, cb) {
  swingSword(char, 28, 34, 3, 23, cb);
};

module.exports = sprite;
