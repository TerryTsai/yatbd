module.exports = function(data, ownId) {
  return data
    .split('\n')
    .slice(0, -1)
    .map(person => person.split(','))
    .filter(person => person[0] !== ownId)
    .reduce((accum, person) => {
      accum[person[0]] = {
        id: person[0],
        action: person[1],
        direction: person[2],
        x: person[3],
        y: person[4],
        mapX: person[5],
        mapY: person[6]
      };
      return accum;
    }, {});
}
