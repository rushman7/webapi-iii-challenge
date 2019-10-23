const express = require('express');

const router = express.Router();
const postDB = require('./postDb');
const userDB = require('../users/userDb');

router.get('/', (req, res) => {
  const sortField = req.query.sortBy || 'id';

  postDB.get()
    .then(posts => {
      const response = posts.sort((a,b) => a[sortField] < b[sortField] ? -1 : 1)
      res.status(200).json(response)
    })
    .catch(() => res.status(500).json({ error: "The posts information could not be retrieved." }))
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  postDB.remove(req.post.id)
    .then(post => {
      if (post) res.status(202).json({ error: `The post with the ID ${req.post.id} has been removed.` })
      else res.status(404).json({ error: "The post with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The post could not be removed" }))
});

router.put('/:id', validatePostId, (req, res) => {
  postDB.update(req.post.id, req.body)
    .then(post => {
      if (post) res.status(200).json({ error: `The post with the ID ${req.post.id} has been updated.` })
      else res.status(404).json({ error: "The post with the specified ID does not exist." })
    })
    .catch(() => res.status(500).json({ error: "The post information could not be modified." }))
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;

  postDB.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else res.status(404).json({ message: "invalid post id" })
    })
    .catch(() => res.status(500).json({ error: "The posts information could not be retrieved." }))
};

module.exports = router;