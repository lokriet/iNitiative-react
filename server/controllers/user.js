const User = require('../model/user');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.userId)
  .then(user => {
    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email
    });
  }).catch(error => {
    next(error);
  });
}