'use strict';

async function handler(request, h) {
	console.log('PAYLOAD', JSON.stringify(request.payload));
	return h.response(request.payload.payload);
}

module.exports = handler;
