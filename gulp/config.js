var path = require('path');
var production = (process.env.NODE_ENV === 'production');

module.exports = {
  dist: production ? 'dist' : '.tmp',
	livereloadPort: 35729,
	port: 9000,
	root: path.resolve('./')
};
