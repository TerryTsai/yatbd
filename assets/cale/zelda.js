var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;

var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(720, 720);
document.body.appendChild(renderer.view);

PIXI.loader
    .add(['cale/zelda/images/kakariko.png', 'cale/zelda/images/links-0.json'])
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
  map.scale = new PIXI.Point(2, 2);

  var linkTextures = PIXI.loader.resources['cale/zelda/images/links-0.json'].textures;

  link = new Sprite(linkTextures['poop_01.png']);
  link.scale = new PIXI.Point(2, 2);
  link.x = 15;
  link.y = 15;
  link.vx = 0;
  link.vy = 0;

  stage.addChild(map);
  stage.addChild(link);

  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  left.press = function() {
    link.vx = -5;
    link.vy = 0;
    link.texture = linkTextures['poop_01.png'];
  };
  left.release = function() {
    if (!right.isDown && link.vy === 0) {
      link.vx = 0;
    }
  };
  up.press = function() {
    link.vy = -5;
    link.vx = 0;
    link.texture = linkTextures['poop_88.png'];
  };
  up.release = function() {
    if (!down.isDown && link.vx === 0) {
      link.vy = 0;
    }
  };
  right.press = function() {
    link.vx = 5;
    link.vy = 0;
    link.texture = linkTextures['poop_96.png'];
  };
  right.release = function() {
    if (!left.isDown && link.vy === 0) {
      link.vx = 0;
    }
  };
  down.press = function() {
    link.vy = 5;
    link.vx = 0;
    link.texture = linkTextures['poop_01.png'];
  };
  down.release = function() {
    if (!up.isDown && link.vx === 0) {
      link.vy = 0;
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
      map.x += 720;
      link.x = 720;
    }
  } else if(link.x + link.vx > 720) {
    if (map.x > -1440) {
      map.x -= 720;
      link.x = -link.width;
    }
  } else {
    link.x += link.vx;
  }

  if(link.y + link.vy < -link.height) {
    if (map.y < 0) {
      map.y += 720;
      link.y = 720;
    }
  } else if(link.y + link.vy > 720) {
    if (map.y > -1440) {
      map.y -= 720;
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
