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
      }
      req.user = user;
      next();
  } catch { 
    next({ message: "The user information could not be retrieved" });
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};