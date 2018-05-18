'use strict';

const { spawn } = require('child_process');
// const program = require('commander');
const deploymentBranches = ['dev', 'production'];
const pathProjects = '/Users/fullfactory/workspace';

async function handler(request, h) {
	const { branch, status, reponame } = request.payload.payload;
	if (status === 'success') {
		if (deploymentBranches.includes(branch)) {
			const deploymentFile = `${pathProjects}/${reponame}/deployment.json`;
			const deploySh = spawn('sh', ['deployment.sh', deploymentFile, branch], {
				cwd: __dirname,
				env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' }),
			});
			deploySh.stdout.on('data', (w) => {
				console.log('D', w.toString());
			});
			deploySh.on('close', (code) => {
				console.log('code', code);
			});
			return h.response();
		}
	}
	return h.response();
}

module.exports = handler;
