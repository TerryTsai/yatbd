var webpack = require('webpack');
var path = require("path");

module.exports = {
  entry: [
    path.join(__dirname, 'zelda.js')
  ],
  output: {
    path: __dirname,
    filename: "bundle.js"
  }
};
