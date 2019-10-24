const express = require('express');
const cors = require('cors');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
require('dotenv').config();

const server = express();
const port = process.env.PORT;

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

server.get('/', (req, res) => {
  res.send(`<h2>App is Deployed</h2>`)
})

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter)

server.listen(port, () => console.log(`Server is running on port ${port}`));