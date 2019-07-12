const url = require('url');
const argv = require('yargs').argv;
const utils = require('./utils');
const package = require('../package.json');

const config = {
	host: 'localhost',
	port: 8000,
	open: 'external',
	files: [
		utils.buildPath('**/*.css'),
		utils.buildPath('**/*.js'),
		utils.buildPath('**/*.html')
	],
	ghostMode: {
		clicks: false,
		scroll: true,
		forms: {
			submit: true,
			inputs: true,
			toggles: true
		}
	},
	snippetOptions: {
		rule: {
			match: /<\/body>/i,
			fn: (snippet, match) => `${snippet}${match}`
		}
	},
	server: {
        baseDir: utils.buildPath(),
        directory: package.browsersync.server.directory
    },
    proxy: package.browsersync.proxy,
	reloadThrottle: 100
};

/**
 * Load the proxy configuration from cli arguments.
 */
if (argv.devUrl !== undefined) {
	config.host = url.parse(argv.devUrl).hostname;
	config.proxy = argv.devUrl;

	delete config.server;
}

module.exports = config;
