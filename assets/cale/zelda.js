var PIXI = require('pixi.js');
var SpriteUtilities = require('./spriteUtilities');

var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;

var spUtil = new SpriteUtilities(PIXI);
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(720, 720);
document.body.appendChild(renderer.view);

var otherLinks = [];
var socket = new WebSocket('ws://' + window.location.host + '/zeldaws');
socket.onopen = function (event) {
};

socket.onclose = function() {
  console.log('closed');
};

var myId;
socket.onmessage = function (event) {
  if (!myId) {
    myId = event.data.split(',')[0];
    return;
  }

  var linksById = event.data
    .split('\n')
    .slice(0, -1)
    .map(person => person.split(','))
    .filter(person => person[0] !== myId)
    .reduce((accum, person) => {
      accum[person[0]] = {
        id: person[0],
        action: person[1],
        direction: person[2],
        x: person[3],
        y: person[4]
      };
      return accum;
    }, {});

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
          return link.action === 'MOVE' ? walkUp(link.sprite) : standUp(link.sprite);
        case 'down':
          return link.action === 'MOVE' ? walkDown(link.sprite) : standDown(link.sprite);
        case 'left':
          return link.action === 'MOVE' ? walkLeft(link.sprite) : standLeft(link.sprite);
        case 'right':
          return link.action === 'MOVE' ? walkRight(link.sprite) : standRight(link.sprite);
      }
    } else {
      var sprite = createLink(parseFloat(link.x), parseFloat(link.y), linkTextures);
      sprite.show(3);
      sprite.fps = 20;
      sprite.vx = 0;
      sprite.vy = 0;
      link.sprite = sprite;
      stage.addChild(sprite);
    }
  });
};

setInterval(() => {
  otherLinks.forEach(function(link) {
    if (link.sprite) {
      link.sprite.x = parseFloat(link.x);
      link.sprite.y = parseFloat(link.y);
    }
  });
}, 200);

var createLink = function(x, y, linkTextures) {
  return spUtil.sprite([
    linkTextures['downlink0.png'],
    linkTextures['downlink1.png'],
    linkTextures['downlink2.png'],
    linkTextures['downlink3.png'],
    linkTextures['downlink4.png'],
    linkTextures['downlink5.png'],
    linkTextures['downlink6.png'],
    linkTextures['uplink0.png'],
    linkTextures['uplink1.png'],
    linkTextures['uplink2.png'],
    linkTextures['uplink3.png'],
    linkTextures['uplink4.png'],
    linkTextures['uplink5.png'],
    linkTextures['uplink6.png'],
    linkTextures['rightlink0.png'],
    linkTextures['rightlink1.png'],
    linkTextures['rightlink2.png'],
    linkTextures['rightlink3.png'],
    linkTextures['rightlink4.png'],
    linkTextures['rightlink5.png'],
    linkTextures['rightlink6.png']
  ], x, y);
};

PIXI.loader
    .add(['cale/zelda/images/kakariko.png', 'cale/zelda/images/links.json'])
    .load(setup);

var link;
var map;
var state;

var walkLeft = function(char) {
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

var standLeft = function(char) {
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

var walkUp = function(char) {
  char.vy = -1.5;
  char.vx = 0;
  char.playAnimation([7, 13]);
};

var standUp = function(char) {
  char.vy = 0;
  char.stopAnimation();
  char.show(10);
};

var walkRight = function(char) {
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

var standRight = function(char) {
  char.vx = 0;
  char.stopAnimation();
  char.show(17);
  if (char.isLeft) {
    char.position.x -= 20;
    char.isLeft = false;
  }
  char.scale.x = 1;
};

var walkDown = function(char) {
  char.vy = 1.5;
  char.vx = 0;
  char.playAnimation([0, 6]);
};

var standDown = function(char) {
  char.vy = 0;
  char.show(3);
};

var linkTextures;
function setup() {
  map = new Sprite(
    resources['cale/zelda/images/kakariko.png'].texture
  );
  map.x = -720;
  map.y = -720;

  linkTextures = PIXI.loader.resources['cale/zelda/images/links.json'].textures;

  link = createLink(0, 0, linkTextures);
  link.show(3);
  link.fps = 20;
  link.vx = 0;
  link.vy = 0;

  stage.scale = new PIXI.Point(2, 2);
  stage.addChild(map);
  stage.addChild(link);

  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  var leftInterval, rightInterval, downInterval, upINterval;
  left.press = function() {
    walkLeft(link);
    leftInterval = setInterval(() => {
      socket.send('s,MOVE,left,' + link.x + ',' + link.y);
    }, 200);
  };
  left.release = function() {
    clearInterval(leftInterval);
    if (!right.isDown) {
      standLeft(link);
      socket.send('s,STAND,left,' + link.x + ',' + link.y);
    }
  };

  up.press = function() {
    walkUp(link);
    upInterval = setInterval(() => {
      socket.send('s,MOVE,up,' + link.x + ',' + link.y);
    }, 200);
  };
  up.release = function() {
    clearInterval(upInterval);
    if (!down.isDown && link.vx === 0) {
      standUp(link);
      socket.send('s,STAND,up,' + link.x + ',' + link.y);
    }
  };

  right.press = function() {
    walkRight(link);
    rightInterval = setInterval(() => {
      socket.send('s,MOVE,right,' + link.x + ',' + link.y);
    }, 200);
  };
  right.release = function() {
    clearInterval(rightInterval);
    if (!left.isDown && link.vy === 0) {
      standRight(link);
      socket.send('s,STAND,right,' + link.x + ',' + link.y);
    }
  };

  down.press = function() {
    walkDown(link);
    downInterval = setInterval(() => {
      socket.send('s,MOVE,down,' + link.x + ',' + link.y);
    }, 200);
  };
  down.release = function() {
    clearInterval(downInterval);
    if (!up.isDown && link.vx === 0) {
      standDown(link);
      socket.send('s,STAND,down,' + link.x + ',' + link.y);
    }
  };
  state = play;

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  state();

  renderer.render(stage);
}

function play() {
  if(link.x + link.vx < -link.width) {
    if (map.x < 0) {
      map.x += 360;
      link.x = 360;
    }
  } else if(link.x + link.vx > 360) {
    if (map.x > -720) {
      map.x -= 360;
      link.x = -link.width;
    }
  } else {
    link.x += link.vx;
  }

  if(link.y + link.vy < -link.height) {
    if (map.y < 0) {
      map.y += 360;
      link.y = 360;
    }
  } else if(link.y + link.vy > 360) {
    if (map.y > -720) {
      map.y -= 360;
      link.y = -link.height;
    }
  } else {
    link.y += link.vy;
  }

  otherLinks.forEach(function(link) {
    if(link.x + link.vx < -link.width) {
      link.x = 360;
    } else if(link.x + link.vx > 360) {
      link.x = -link.width;
    } else {
      link.sprite.x += link.sprite.vx;
      link.sprite.y += link.sprite.vy;
    }
  });
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
  };

  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
  };
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
