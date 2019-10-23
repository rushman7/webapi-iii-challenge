const express = require('express');
const cors = require('cors');

const server = express();
server.use(express.json())
server.use(cors());

const userRouter = require('./users/userRouter');

server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
  );
  next();
};

server.use(logger);

server.listen(5000, () => console.log('Server is running on port 5000'))

module.exports = server;
