const User = require('../model/user');
const Encounter = require('../model/encounter');
const ParticipantTemplate = require('../model/participantTemplate');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      return res.status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      });
    })
    .catch(error => {
      next(error);
    });
};

module.exports.getUserAvatarUrls = async (req, res, next) => {
  try {
    const encounterAvatarUrls = await Encounter.find({ creator: req.userId }).distinct('participants.avatarUrl');
    console.log(encounterAvatarUrls);

    const templateAvatarUrls = await ParticipantTemplate.find({creator: req.userId}).distinct('avatarUrl');
    console.log(templateAvatarUrls);

    const avatarUrlsSet = new Set([...encounterAvatarUrls, ...templateAvatarUrls]);
    avatarUrlsSet.delete("");
    avatarUrlsSet.delete(null);

    res.status(200).json(Array.from(avatarUrlsSet));
  } catch (error) {
    next(error);
  }
};
