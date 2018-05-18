'use strict';

const deploymentBranches = ['dev', 'production'];

async function handler(request, h) {
	const { branch, status, reponame } = request.payload.payload;
	// console.log('PAYLOAD', JSON.stringify(request.payload));
	console.log('Deployment to ', branch, status, reponame);
	if (status === 'success') {
		if (deploymentBranches.includes(branch)) {
			// console.log('Deployment to ', branch, status, reponame);
			return h.response();
		}
	}
	return h.response();
}

module.exports = handler;
