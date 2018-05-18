'use strict';

const handler = require('./build.handler');

const route = {
	handler,
	method: 'POST',
	path: '/builds',
};

module.exports = route;
