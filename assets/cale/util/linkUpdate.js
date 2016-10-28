exports.updateOwnLink = function(link) {
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
};

exports.updateOtherLink = function(link) {
  if(link.x + link.vx < -link.width) {
    link.x = 360;
  } else if(link.x + link.vx > 360) {
    link.x = -link.width;
  } else {
    link.x += link.vx;
    link.y += link.vy;
  }
};
