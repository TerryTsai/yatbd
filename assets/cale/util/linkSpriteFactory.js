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
    linkTextures['rightlink6.png'],
    linkTextures['leftlink0.png'],
    linkTextures['leftlink1.png'],
    linkTextures['leftlink2.png'],
    linkTextures['leftlink3.png'],
    linkTextures['leftlink4.png'],
    linkTextures['leftlink5.png'],
    linkTextures['leftlink6.png'],
    linkTextures['downlinkswordswing0.png'],
    linkTextures['downlinkswordswing2.png'],
    linkTextures['downlinkswordswing4.png'],
    linkTextures['downlinkswordswing5.png'],
    linkTextures['downlinkswordswing3.png'],
    linkTextures['downlinkswordswing1.png'],
    linkTextures['uplinkswordswing0.png'],
    linkTextures['uplinkswordswing1.png'],
    linkTextures['uplinkswordswing2.png'],
    linkTextures['uplinkswordswing3.png'],
    linkTextures['uplinkswordswing4.png'],
    linkTextures['uplinkswordswing5.png'],
    linkTextures['uplinkswordswing6.png'],
    linkTextures['uplinkswordswing7.png'],
    linkTextures['uplinkswordswing8.png'],
    linkTextures['rightlinkswordswing0.png'],
    linkTextures['rightlinkswordswing1.png'],
    linkTextures['rightlinkswordswing2.png'],
    linkTextures['rightlinkswordswing3.png'],
    linkTextures['rightlinkswordswing4.png'],
    linkTextures['rightlinkswordswing5.png'],
    linkTextures['rightlinkswordswing6.png'],
    linkTextures['rightlinkswordswing7.png'],
    linkTextures['rightlinkswordswing8.png'],
    linkTextures['leftlinkswordswing8.png'],
    linkTextures['leftlinkswordswing7.png'],
    linkTextures['leftlinkswordswing0.png'],
    linkTextures['leftlinkswordswing1.png'],
    linkTextures['leftlinkswordswing2.png'],
    linkTextures['leftlinkswordswing3.png'],
    linkTextures['leftlinkswordswing4.png'],
    linkTextures['leftlinkswordswing5.png'],
    linkTextures['leftlinkswordswing6.png']
  ], x, y);
  sprite.show(3);
  sprite.fps = 20;
  sprite.vx = 0;
  sprite.vy = 0;
  sprite.mapX = 0;
  sprite.mapY = 0;
  sprite.direction = 'down';

  return sprite;
};
