const { Comment } = require('../models');

exports.voteOnComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  Comment.findById(comment_id)

    .then(comment => {
      if (comment === null) {
        return Promise.reject({
          status: 404,
          msg: `Comment not found for comment: ${comment_id}`
        });
      } else {
        vote === 'up'
          ? comment.votes++
          : vote === 'down' && comment.votes > 0
          ? comment.votes--
          : comment.votes;
        const newVote = comment.votes;
        return Comment.findByIdAndUpdate(
          comment_id,
          { $set: { votes: newVote } },
          { new: true }
        )
          .populate('belongs_to', 'title -_id')
          .populate('created_by', 'username -_id')
          .then(comment => {
            res.status(200).send({ comment });
          })
          .catch(next);
      }
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.findByIdAndRemove(comment_id)
    .populate('belongs_to', 'title -_id')
    .populate('created_by', 'username -_id')
    .then(comment => {
      if (comment === null) {
        return Promise.reject({
          status: 404,
          msg: `Comment not found for comment ${comment_id}`
        });
      }
      res.status(202).send({
        comment
      });
    })
    .catch(next);
};
