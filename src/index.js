'use strict';
require('dotenv').config();

const Hapi = require('hapi');
const route = require('./build.route');

const server = Hapi.Server({
	host: '0.0.0.0',
	port: 2000,
});

server.route(route);

(async () => {
	await server.start();
	console.log(`Server Started: ${server.info.uri}`);
})();
