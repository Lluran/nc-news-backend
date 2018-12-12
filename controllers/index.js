const {
  displayEndPoints
} = require('./api');
const {
  findTopics,
  findArticlesByTopic,
  addArticle
} = require('./topics')
const {
  findArticles,
  findArticleByID,
  findCommentsForArticle,
  addComment,
  voteOnArticle
} = require('./articles')
const {
  voteOnComment,
  removeComment
} = require('./comments');

const {
  findUser
} = require('./users')

module.exports = {
  displayEndPoints,
  findTopics,
  findArticlesByTopic,
  addArticle,
  findArticles,
  findArticleByID,
  findCommentsForArticle,
  addComment,
  voteOnArticle,
  voteOnComment,
  removeComment,
  findUser
}