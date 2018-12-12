const mongoose = require('mongoose');
const {
  Article,
  Comment,
  Topic,
  User
} = require('../models');
const {
  createArticleDocs,
  createUserRefObj,
  createArticleRefObj,
  createCommentDocs
} = require('../utils')

function seedDB({
  articles,
  comments,
  topics,
  users
}) {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Topic.insertMany(topics)
    })
    .then(topicDocs => {
      return Promise.all([topicDocs, User.insertMany(users)])
    })
    .then(([topicDocs, userDocs]) => {
      const userRefObj = createUserRefObj(userDocs);
      return Promise.all([topicDocs, userDocs, userRefObj, Article.insertMany(createArticleDocs(articles, userRefObj))])
    })
    .then(([topicDocs, userDocs, userRefObj, articleDocs]) => {
      const articleRefObj = createArticleRefObj(articleDocs);
      return Promise.all([topicDocs, userDocs, articleDocs, Comment.insertMany(createCommentDocs(comments, userRefObj, articleRefObj))])
    })
    .catch(console.log)
}

module.exports = {
  seedDB
};