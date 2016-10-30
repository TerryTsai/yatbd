exports.updateOwnLink = function(link, map) {
  if(link.x + link.vx < -link.width) { // pan map left
    if (map.x < 0) {
      map.x += 360;
      link.x = 360;
      link.mapX -= 1;
    }
  } else if(link.x + link.vx > 360) {
    if (map.x > -720) { // pan map right
      map.x -= 360;
      link.x = -link.width;
      link.mapX += 1;
    }
  } else {
    link.x += link.vx;
  }

  if(link.y + link.vy < -link.height) {
    if (map.y < 0) { // pan map up
      map.y += 360;
      link.y = 360;
      link.mapY -= 1;
    }
  } else if(link.y + link.vy > 360) {
    if (map.y > -720) { // pan map down
      map.y -= 360;
      link.y = -link.height;
      link.mapY += 1;
    }
  } else {
    link.y += link.vy;
  }
};

exports.updateOtherLink = function(link, ownLink) {
  if (link.mapX !== ownLink.mapX || link.mapY !== ownLink.mapY) {
    link.visible = false;
    return;
  } else {
    link.visible = true;
  }
  link.x += link.vx;
  link.y += link.vy;
};
