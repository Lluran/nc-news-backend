const { Article, Comment } = require('../models');

const { addCommentCount } = require('../utils');

exports.findArticles = (req, res, next) => {
  Article.find()
    .populate('created_by', 'username -_id')
    .then(articleDocs => {
      return Promise.all(articleDocs.map(addCommentCount));
    })
    .then(articles => {
      res.status(200).send({
        articles
      });
    })
    .catch(next);
};

exports.findArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .populate('created_by', 'username -_id')
    .then(articleDoc => {
      if (articleDoc === null) {
        return Promise.reject({
          status: 404,
          msg: `Article not found for ${article_id}`
        });
      }
      return addCommentCount(articleDoc);
    })
    .then(article => {
      res.status(200).send({
        article
      });
    })
    .catch(next);
};

exports.findCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({
    belongs_to: article_id
  })
    .populate('created_by', 'username -_id')
    .populate('belongs_to', 'title -_id')
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment not found for article ${article_id}`
        });
      }
      res.status(200).send({
        comments
      });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const belongs_to = article_id;
  const { body, created_by } = req.body;
  const newComment = new Comment({
    body,
    belongs_to,
    created_by
  });
  newComment
    .save()
    .then(comment => {
      return Comment.findById(comment._id)
        .populate('belongs_to', 'title -_id')
        .populate('created_by', 'username -_id');
    })
    .then(comment => {
      res.status(201).send({
        comment
      });
    })
    .catch(next);
};

exports.voteOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  Article.findById(article_id)
    .then(articleDoc => {
      if (articleDoc === null) {
        return Promise.reject({
          status: 404,
          msg: `Article not found for article: ${article_id}`
        });
      } else {
        vote === 'up'
          ? articleDoc.votes++
          : vote === 'down' && articleDoc.votes > 0
          ? articleDoc.votes--
          : articleDoc.votes;
        const newVote = articleDoc.votes;
        return Article.findByIdAndUpdate(
          article_id,
          { $set: { votes: newVote } },
          { new: true }
        )
          .populate('created_by', 'username -_id')
          .then(article => {
            return addCommentCount(article)
              .then(article => res.status(200).send({ article }))
              .catch(next);
          });
      }
    })
    .catch(next);
};
