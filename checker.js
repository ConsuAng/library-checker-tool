const { Command } = require('commander');
const check = require('./commands/check');

const program = new Command();

program
	.description('run options')
	.option("-u, --update <library name>", "Update your library of interest")
	.option("-b, --build <library name>", "Update and build your project with your library of interest")
	.option("--serve", "serve your angular project")
	.action(check)

program.parse(process.argv);