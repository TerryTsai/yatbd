var PIXI = require('pixi.js');
var SpriteUtilities = require('../vendor/spriteUtils');
var spUtil = new SpriteUtilities(PIXI);

module.exports = function(x, y, linkTextures) {
  var sprite = spUtil.sprite([
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
  sprite.show(3);
  sprite.fps = 20;
  sprite.vx = 0;
  sprite.vy = 0;
  sprite.mapX = 0;
  sprite.mapY = 0;

  return sprite;
};
