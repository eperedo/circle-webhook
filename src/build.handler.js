'use strict';

require('dotenv').config();
const axios = require('axios');
const { spawn } = require('child_process');
const deploymentBranches = ['dev', 'production'];
const allowedRepos = process.env.repositories.split(',');
const homePath = process.env.HOME;
const projectsPath = `${homePath}/node`;
const githubAppRunn = 'https://github.com/apprunn';

const deploySh = spawn('sh', ['deployment.sh'], {
	cwd: __dirname,
	env: Object.assign({}, process.env, {
		PATH: process.env.PATH + ':/usr/local/bin',
	}),
});

deploySh.stdout.on('data', w => console.log(w));

deploySh.stderr.on('data', w => console.log(w.toString()));

deploySh.on('close', code => {
	console.log('Exit code', code);
});

async function handler(request, h) {
	const { branch, status, reponame } = request.payload.payload;
	if (status === 'success' && allowedRepos.includes(reponame)) {
		if (deploymentBranches.includes(branch)) {
			const deploymentFile = `${projectsPath}/${reponame}/source/deployment.json`;
			const deploySh = spawn('sh', ['deployment.sh'], {
				cwd: __dirname,
				env: Object.assign({}, process.env, {
					PATH: process.env.PATH + ':/usr/local/bin',
				}),
			});
			deploySh.on('close', async code => {
				const slackMessage = {
					fallback: `New Deployment on ${reponame}`,
					color: 'good',
					fields: [
						{
							title: 'Repository',
							value: `<${githubAppRunn}/${reponame}|${reponame}>`,
							short: false,
						},
						{
							title: 'Branch',
							value: `<${githubAppRunn}/${reponame}/tree/${branch}|${branch}>`,
							short: false,
						},
					],
				};
				if (code === 0) {
					slackMessage.text = `Deployment in ${reponame} to branch: ${branch} on ${new Date()}`;
				} else {
					slackMessage.color = 'danger';
					slackMessage.text = `Deployment failed: ${reponame} to branch: ${branch} on ${new Date()}`;
				}
				await axios.post(process.env.SLACK_WEBHOOK_URL, slackMessage);
			});
			return h.response();
		}
	}
	return h.response();
}

module.exports = handler;
