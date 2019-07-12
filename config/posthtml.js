/**
 * The module dependencies.
 */
const utils = require('./utils');
const settings = require('./settings');
const expressions = require('posthtml-expressions')

/**
 * Export the configuration.
 */
module.exports = context => {
	return {
		plugins: [
			require('posthtml-include')({
				root: utils.srcPath('partials')
            }),
            expressions({ locals: { projectName: settings.projectName } })
		],
        options: { 
            closingSingleTag: 'slash'
        }
	};
};
