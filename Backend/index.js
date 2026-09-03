const yargs=require('yargs');
const { hideBin } = require('yargs/helpers');
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pushRepo } = require('./controllers/push');
const { pullRepo } = require('./controllers/pull');
const { revertRepo } = require('./controllers/revert');
yargs(hideBin(process.argv))
  .command('init', 'Initialize the repository',  {}, initRepo)
  .command('add <file>', 'Add files to the index',(yargs)=>{yargs.positional("file",{describe: "The file to add to stagging area.",type:"string",})}, addRepo)
  .command('commit <message>', 'Commit changes to the repository', (yargs) => {
    yargs.positional('message', {
      describe: 'The commit message',
      type: 'string',
    })})
    .command('push', 'Push changes to the remote repository', {}, pushRepo)
    .command('pull', 'Pull changes from the remote repository', {}, pullRepo)
    .command('revert <commitID>', 'Revert to a specific commit', (yargs) => {
      yargs.positional('commitID', {
        describe: 'The commit hash to revert to',
        type: 'string',
      });
    })
  
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv;