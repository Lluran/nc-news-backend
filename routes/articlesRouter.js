const articlesRouter = require('express').Router();

const {
  findArticles,
  findArticleByID,
  findCommentsForArticle,
  addComment,
  voteOnArticle
} = require('../controllers')

articlesRouter.route('/')
  .get(findArticles)

articlesRouter.route('/:article_id')
  .get(findArticleByID)
  .patch(voteOnArticle)

articlesRouter.route('/:article_id/comments')
  .get(findCommentsForArticle)
  .post(addComment)

module.exports = articlesRouter;