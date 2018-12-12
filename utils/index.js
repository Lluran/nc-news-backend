const {
  Comment
} = require('../models')

function createUserRefObj(userDocs) {
  return userDocs.reduce((userRefObj, userDoc) => {
    userRefObj[userDoc.username] = userDoc._id;
    return userRefObj;
  }, {})
}

function createArticleDocs(articles, userRefObj) {
  return articles.map((article) => {
    return {
      ...article,
      belongs_to: article.topic,
      created_by: userRefObj[article.created_by]
    }
  })
}

function createArticleRefObj(articleDocs) {
  return articleDocs.reduce((articleRefObj, article) => {
    articleRefObj[article.title] = article._id;
    return articleRefObj;
  }, {})
}

function createCommentDocs(comments, userRefObj, articleRefObj) {
  return comments.map((comment) => {
    return {
      ...comment,
      created_by: userRefObj[comment.created_by],
      belongs_to: articleRefObj[comment.belongs_to]
    }
  })
}

function addCommentCount(article) {
  return Comment.countDocuments({
      belongs_to: article._id
    })
    .then(numCount => {
      return {
        ...article._doc,
        comment_count: numCount
      }
    })
}

module.exports = {
  createUserRefObj,
  createArticleDocs,
  createArticleRefObj,
  createCommentDocs,
  addCommentCount
}