'use strict';

const { spawn } = require('child_process');
const deploymentBranches = ['dev', 'production'];
const allowedRepos = process.env.repositories.split(',');
const homePath = process.env.HOME;
const projectsPath = `${homePath}/node`;

async function handler(request, h) {
	const { branch, status, reponame } = request.payload.payload;
	if (status === 'success' && allowedRepos.includes(reponame)) {
		if (deploymentBranches.includes(branch)) {
			const deploymentFile = `${projectsPath}/${reponame}/source/deployment.json`;
			const deploySh = spawn('sh', ['deployment.sh', deploymentFile, branch], {
				cwd: __dirname,
				env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' }),
			});
			deploySh.on('close', (code) => {
				if (code === 0) {
					console.log(`Deployment in ${reponame} to branch: ${branch} on ${new Date()}`);
				} else {
					console.log(`Deployment failed: ${reponame} to branch: ${branch} on ${new Date()}`);
				}
			});
			return h.response();
		}
	}
	return h.response();
}

module.exports = handler;
