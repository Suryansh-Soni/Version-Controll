const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pushRepo } = require('./controllers/push');
const { pullRepo } = require('./controllers/pull');
const { revertRepo } = require('./controllers/revert');
const mainRouter = require('./routes/main.router'); 


dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start the version control system", {}, startServer)
  .command(
    'init',
    'Initialize the repository',
    {},
    initRepo
  ).command(
    'add <file>',
    'Add files to the index',
    (yargs) => {
      yargs.positional('file', {
        describe: 'The file to add to staging area.',
        type: 'string',
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )

  .command(
    'commit <message>',
    'Commit changes to the repository',
    (yargs) => {
      yargs.positional('message', {
        describe: 'The commit message',
        type: 'string',
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )

  .command(
    'push',
    'Push changes to the remote repository',
    {},
    pushRepo
  )

  .command(
    'pull',
    'Pull changes from the remote repository',
    {},
    pullRepo
  )

  .command(
    'revert <commitID>',
    'Revert to a specific commit',
    (yargs) => {
      yargs.positional('commitID', {
        describe: 'The commit hash to revert to',
        type: 'string',
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )

  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv; 

function startServer() {
  const app = express();
  const port=3000;  
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());

  const mongoURI = process.env.MONGODB_URI;

  mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
  app.use(cors({origin: '*'}));
  
  app.use("/",mainRouter);
  let user="test";
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  }); 
  io.on('connection', (socket) => {
    socket.on('message', (data) => {
      user=userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socket.join(userID);
    })});

    const db=mongoose.connection;
    db.once('open', () => {
      console.log('Connected to MongoDB');
      const changeStream = db.collection('commits').watch();
      changeStream.on('change', (change) => {
        console.log('Change detected:', change);
        io.to(user).emit('commitChange', change);
      });
    });

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
}