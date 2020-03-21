const News = require('../model/news');

module.exports.getNews = async (req, res, next) => {
  try {
    const news = await News.find({}, '', { sort: { createdAt: -1 } });
    console.log(news);
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};
