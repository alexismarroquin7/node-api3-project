const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require("./users-model");
const Post = require("../posts/posts-model");

const mw = require("../middleware/middleware");

const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await User.get();
    res.status(200).json(users);
  } catch {
    next({ message: "The users information could not be retrieved" });
  }
});

router.get('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post('/', mw.validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const newUser = await User.insert(req.user);
    res.status(201).json(newUser);
  } catch {
    next({ message: "The new user was not saved to the db" })
  }
});

router.put('/:id', mw.validateUserId, mw.validateUser, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const updatedUser = await User.update(req.params.id, req.user)
    res.status(200).json(updatedUser);
  } catch {
    next({ message: "The updates to user were not saved to the db" });
  }
  
});

router.delete('/:id', mw.validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const deletedUser = await User.remove(req.user.id);
    res.status(200).json(deletedUser);
  } catch {
    next({ message: "The user was not able to be deleted"});
  }
});

router.get('/:id/posts', mw.validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const posts = await Post.getByUserId(req.user.id);
    res.status(200).json(posts);
  } catch {
    next({ message: "The posts were not able to be retrieved" })
  }
});

router.post('/:id/posts', mw.validateUserId, mw.validatePost, async (req, res, next) => {

  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const newPost = await Post.insert({
      ...req.post,
      user_id: req.user.id
    });
    res.status(201).json(newPost);
  } catch {
    next({ message: "The new post was not saved to the db" });
  }

});

router.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

// do not forget to export the router
module.exports = router;