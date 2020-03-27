const Encounter = require('../model/encounter');
const ParticipantTemplate = require('../model/participantTemplate');
const httpErrors = require('../util/httpErrors');

module.exports.getUserAvatarUrls = async (req, res, next) => {
  try {
    const encounterAvatarUrls = await Encounter.find({
      creator: req.userId
    }).distinct('participants.avatarUrl');
    const templateAvatarUrls = await ParticipantTemplate.find({
      creator: req.userId
    }).distinct('avatarUrl');

    const avatarUrlsSet = new Set([
      ...encounterAvatarUrls,
      ...templateAvatarUrls
    ]);
    avatarUrlsSet.delete('');
    avatarUrlsSet.delete(null);

    res.status(200).json(Array.from(avatarUrlsSet));
  } catch (error) {
    next(error);
  }
};

module.exports.getEncounterAvatarUrls = async (req, res, next) => {
  try {
    const encounterId = req.params.encounterId;

    const encounter = await Encounter.findOne({
      _id: encounterId
    });

    if (!encounter) {
      httpErrors.pageNotFoundError();
      return;
    }

    if (req.userId.toString() !== encounter.creator.toString()) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    const avatarUrls = await Encounter.find({
      creator: req.userId,
      _id: encounterId
    }).distinct('participants.avatarUrl');
    avatarUrls.filter(item => item !== '' && item != null);

    res.status(200).json(avatarUrls);
  } catch (error) {
    next(error);
  }
};
