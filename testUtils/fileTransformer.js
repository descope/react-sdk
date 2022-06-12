const path = require('path');

module.exports = {
	process: (_, sourcePath) => ({
		code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`
	})
};