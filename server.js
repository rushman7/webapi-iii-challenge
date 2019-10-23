const express = require('express');
const cors = require('cors');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json())
server.use(cors());

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get('Origin')}`
  );
  next();
};

server.use(logger);

server.use((err, req, rest, next) => {
  console.error(err);

  res.status(500).json({ message: 'There was an error performing the required operation', error: err })
})

server.use('/api/users', userRouter);

server.listen(5000, () => console.log('Server is running on port 5000'));