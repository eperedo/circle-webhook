'use strict';

async function handler(request, h) {
	console.log('PAYLOAD', request.payload);
	return h.response(request.payload);
}

module.exports = handler;
