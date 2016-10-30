var sprite = {};

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

sprite.swingSwordLeft = function(char) {
  char.loop = false;
  char.fps = 30;
  char.playAnimation([51, 59]);
  var waitInterval = setInterval(() => {
    if (char.currentFrame === 59) {
      clearInterval(waitInterval);
      char.loop = true;
      char.fps = 20;
      char.show(24);
    }
  });
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

sprite.swingSwordUp = function(char) {
  char.loop = false;
  char.fps = 30;
  char.playAnimation([33, 41]);
  var waitInterval = setInterval(() => {
    if (char.currentFrame === 41) {
      clearInterval(waitInterval);
      char.loop = true;
      char.fps = 20;
      char.show(10);
    }
  });
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

sprite.swingSwordRight = function(char) {
  char.loop = false;
  char.fps = 30;
  char.playAnimation([42, 50]);
  var waitInterval = setInterval(() => {
    if (char.currentFrame === 50) {
      clearInterval(waitInterval);
      char.loop = true;
      char.fps = 20;
      char.show(17);
    }
  });
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

sprite.swingSwordDown = function(char) {
  char.loop = false;
  char.fps = 25;
  char.playAnimation([28, 32]);
  var waitInterval = setInterval(() => {
    if (char.currentFrame === 32) {
      clearInterval(waitInterval);
      char.loop = true;
      char.fps = 20;
      char.show(3);
    }
  });
};

module.exports = sprite;
