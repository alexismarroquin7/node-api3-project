const User = require('../users/users-model');

function logger(req, res, next) {
  console.log(`${req.method} ${req.url} [${new Date().toISOString()}]`);

  next();
}

async function validateUserId(req, res, next) {
  const { id } = req.params;
  try {
      const user = await User.getById(id);
      if(!user){
        res.status(404).json({ message: "user not found" });
      } else {
        req.user = user;
        next();
      }
  } catch { 
    next({ message: "The user information could not be retrieved" });
  }
}

async function validateUser(req, res, next) {
  const user = req.body;
  try {
    if(!user.name){
      res.status(400).json({ message: "missing required name field" });
    } else {
      if(!req.params.id){
        const newUser = await User.insert(user);
        req.newUser = newUser;
        next();
      } else {
        const updatedUser = await User.update(req.params.id, user);
        req.updatedUser = updatedUser;
        next();
      }
    }
  } catch {
    next({ message: `The ${!req.params.id ? `new user was` : `updates to user were`} not saved to the db` })
  }
}

async function validatePost(req, res, next) {
  const post = req.body;
  if(!post.text){
    res.status(400).json({ message: "missing required text field" });
  } else {
    req.post = post;
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};