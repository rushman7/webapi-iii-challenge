const express = require('express');
const userDB = require('./userDb');
const postDB = require('../posts/postDb');

const router = express.Router();

router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) res.status(400).json({ error: "Please provide name for the user." })
  else 
    userDB.insert(req.body)
      .then(user => res.status(201).json(user))
      .catch(() => res.status(500).json({ error: "There was an error while saving the user to the database" }))
});

router.post('/:id/posts', (req, res) => {
  const { user_id, text } = req.body;
  console.log(req.body)
  if (!text) res.status(400).json({ error: "Please provide text for the post." })
  else if (!user_id) res.status(404).json({ message: "The user with the specified ID does not exist." })
  else 
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

router.get('/:id', (req, res) => {
  userDB.getById(req.params.id)
    .then(user => {
      if (user) res.status(200).json(user)
      else res.status(404).json({ message: "The user with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The users information could not be retrieved." }))
});

router.get('/:id/posts', (req, res) => {
  userDB.getUserPosts(req.params.id)
    .then(posts => {
      if (posts.length > 0) res.status(200).json(posts)
      else res.status(404).json({ message: "The posts with the specified user ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The posts information could not be retrieved." }))
});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
