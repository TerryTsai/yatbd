var sprite = {};

sprite.walkLeft = function(char) {
  char.vx = -1.5;
  char.vy = 0;
  char.scale.x = -1;
  char.playAnimation([14, 20]);

  if (!char.isLeft) {
    char.position.x += 20;
    char.isLeft = true;
  }

  char.x += 2;
};

sprite.standLeft = function(char) {
  if (char.vy === 0) {
    char.vx = 0;
    char.scale.x = -1;
    char.stopAnimation();
    char.show(17);
    if (!char.isLeft) {
      char.position.x += 20;
      char.isLeft = true;
    }
  }
};

sprite.walkUp = function(char) {
  char.vy = -1.5;
  char.vx = 0;
  char.playAnimation([7, 13]);
};

sprite.standUp = function(char) {
  char.vy = 0;
  char.stopAnimation();
  char.show(10);
};

sprite.walkRight = function(char) {
  char.vx = 1.5;
  char.vy = 0;
  char.x += 2;
  char.playAnimation([14, 20]);

  if (char.isLeft) {
    char.position.x -= 20;
    char.isLeft = false;
  }
  char.scale.x = 1;
};

sprite.standRight = function(char) {
  char.vx = 0;
  char.stopAnimation();
  char.show(17);
  if (char.isLeft) {
    char.position.x -= 20;
    char.isLeft = false;
  }
  char.scale.x = 1;
};

sprite.walkDown = function(char) {
  char.vy = 1.5;
  char.vx = 0;
  char.playAnimation([0, 6]);
};

sprite.standDown = function(char) {
  char.vy = 0;
  char.show(3);
};

module.exports = sprite;
