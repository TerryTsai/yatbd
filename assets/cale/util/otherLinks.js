var omit = require('lodash/omit');

var getAll = function(linksById) {
  return Object.keys(linksById)
    .map(id => {
      return linksById[id];
    });
};
exports.getAll = getAll;

var byId = function(linkArray) {
  return linkArray.reduce((accum, person) => {
    accum[person[0]] = {
      id: person[0],
      action: person[1],
      direction: person[2],
      x: person[3],
      y: person[4]
    };
    return accum;
  }, {});
};

exports.updateLinks = function(oldLinks, newLinks, stage) {
  var disconnectedLinks = omit(oldLinks, Object.keys(newLinks));
  removeOldSprites(disconnectedLinks, stage);
  return setSpritesOnServerObjects(newLinks, oldLinks);
};

var removeOldSprites = function(oldLinks, stage) {
  Object.keys(oldLinks).forEach(id => {
    stage.removeChild(oldLinks[id].sprite);
  });
};

var setSpritesOnServerObjects = function(newLinks, oldLinks) {
  Object.keys(newLinks).forEach(id => {
    if (oldLinks[id]) {
      newLinks[id].sprite = oldLinks[id].sprite;
    }
  });
  return newLinks;
};
