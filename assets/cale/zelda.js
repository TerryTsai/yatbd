var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;

var spUtil = new SpriteUtilities(PIXI);
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(720, 720);
document.body.appendChild(renderer.view);

var exampleSocket = new WebSocket("ws://localhost:8080/zeldaws");
exampleSocket.onopen = function (event) {
};

exampleSocket.onmessage = function (event) {
  console.log(event.data);
};

PIXI.loader
    .add(['cale/zelda/images/kakariko.png', 'cale/zelda/images/links.json'])
    .load(setup);

var link;
var map;
var state;

function setup() {
  map = new Sprite(
      resources['cale/zelda/images/kakariko.png'].texture
  );
  map.x = -720;
  map.y = -720;

  var linkTextures = PIXI.loader.resources['cale/zelda/images/links.json'].textures;

  // link = new Sprite(linkTextures['downlink0.png']);
  link = spUtil.sprite([
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
  ], 15, 15);
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
  left.press = function() {
    link.vx = -1.5;
    link.vy = 0;
    link.scale.x = -1;
    link.playAnimation([14, 20]);
    exampleSocket.send('move,left,' + link.x + ',' + link.y);

    if (!link.isLeft) {
      link.position.x += 20;
      link.isLeft = true;
    }

    link.x += 2;
  };
  left.release = function() {
    if (!right.isDown && link.vy === 0) {
      link.vx = 0;
      link.stopAnimation();
      link.show(17);
      exampleSocket.send('stand,left,' + link.x + ',' + link.y);
    }
  };
  up.press = function() {
    link.vy = -1.5;
    link.vx = 0;
    link.playAnimation([7, 13]);
    exampleSocket.send('move,up,' + link.x + ',' + link.y);
  };
  up.release = function() {
    if (!down.isDown && link.vx === 0) {
      link.vy = 0;
      link.stopAnimation();
      link.show(10);
      exampleSocket.send('stand,up,' + link.x + ',' + link.y);
    }
  };
  right.press = function() {
    link.vx = 1.5;
    link.vy = 0;
    link.x += 2;
    link.playAnimation([14, 20]);
    exampleSocket.send('move,right,' + link.x + ',' + link.y);

    if (link.isLeft) {
      link.position.x -= 20;
      link.isLeft = false;
    }
    link.scale.x = 1;
  };
  right.release = function() {
    if (!left.isDown && link.vy === 0) {
      link.vx = 0;
      link.stopAnimation();
      link.show(17);
      exampleSocket.send('stand,right,' + link.x + ',' + link.y);
    }
  };
  down.press = function() {
    link.vy = 1.5;
    link.vx = 0;
    link.playAnimation([0, 6]);
    exampleSocket.send('move,down,' + link.x + ',' + link.y);
  };
  down.release = function() {
    if (!up.isDown && link.vx === 0) {
      link.vy = 0;
      link.show(3);
      exampleSocket.send('stand,down,' + link.x + ',' + link.y);
    }
  };
  state = play;

  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  state();

  //Render the stage to see the animation
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
