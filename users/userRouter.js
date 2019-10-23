const express = require('express');
const userDB = require('./userDb');
const postDB = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  userDB.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(() => res.status(500).json({ error: "There was an error while saving the user to the database" }))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDB.insert(req.body)
    .then(post => res.status(201).json(post))
    .catch(() => res.status(500).json({ error: "There was an error while saving the post to the database" }))
});

router.get('/', (req, res) => {
  const sortField = req.query.sortBy || 'id';

  userDB.get()
    .then(users => {
      const response = users.sort((a,b) => a[sortField] < b[sortField] ? -1 : 1)
      res.status(200).json(response)
    })
    .catch(() => res.status(500).json({ error: "The users information could not be retrieved." }))
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDB.getUserPosts(req.user.id)
    .then(posts => {
      if (posts.length > 0) res.status(200).json(posts)
      else res.status(404).json({ error: "The posts with the specified user ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The posts information could not be retrieved." }))
});

router.delete('/:id', validateUserId, (req, res) => {
  userDB.remove(req.user.id)
    .then(user => {
      if (user) res.status(202).json({ error: `The user with the ID ${req.user.id} has been removed.` })
      else res.status(404).json({ error: "The user with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The user could not be removed" }))
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  userDB.update(req.user.id, req.body)
    .then(user => {
      if (user) res.status(200).json({ error: `The user with the ID ${req.user.id} has been updated.` })
      else res.status(404).json({ error: "The user with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The user information could not be modified." }))
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  userDB.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else res.status(404).json({ message: "invalid user id" })
    })
    .catch(() => res.status(500).json({ error: "The users information could not be retrieved." }))
};

function validateUser(req, res, next) {
  const { name } = req.body;

  if (!req.body) res.status(400).json({ message: "missing user data" })
  else if (!name) res.status(400).json({ message: "missing required name field" })
  else next();
};

function validatePost(req, res, next) {
  const { text } = req.body;

  if (!req.body) res.status(400).json({ message: "missing post data" })
  else if (!text) res.status(404).json({ message: "missing required text field" })
  else next();
};

module.exports = router;
