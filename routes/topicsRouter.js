const topicsRouter = require('express').Router();

const {
  findTopics,
  findArticlesByTopic,
  addArticle
} = require('../controllers');

topicsRouter.route('/')
  .get(findTopics)

topicsRouter.route('/:topic_slug/articles')
  .get(findArticlesByTopic)
  .post(addArticle)

module.exports = topicsRouter