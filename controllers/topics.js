const {
  Article,
  Topic
} = require('../models')

const {
  addCommentCount
} = require('../utils');

exports.findTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({
        topics
      })
    })
    .catch(next);
}

exports.findArticlesByTopic = (req, res, next) => {
  const {
    topic_slug
  } = req.params
  return Article.find({
      belongs_to: topic_slug
    })
    .populate('created_by', 'username -_id')
    .then((articleDocs) => {
      return Promise.all(articleDocs.map(addCommentCount))
    })
    .then(articles => {
      return articles.length === 0 ? Promise.reject({
          status: 400,
          msg: `Articles not found for topic: ${topic_slug}`
        }) :
        res.status(200).send({
          articles
        })
    })
    .catch(next)
}

exports.addArticle = (req, res, next) => {
  const {
    title,
    body,
    created_by
  } = req.body;
  const {
    topic_slug
  } = req.params;
  const belongs_to = topic_slug;
  const article = new Article({
    title,
    body,
    belongs_to,
    created_by
  });
  article.save()
    .then(insertedArticle => {
      return Article.findById(insertedArticle._id)
        .populate('created_by', 'username -_id')
    })
    .then(insertedArticle => {
      insertedArticle._doc.comment_count = 0
      res.status(201).send({
        insertedArticle
      });
    })
    .catch(next);
}