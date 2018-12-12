const commentsRouter = require('express').Router();

const {
  voteOnComment,
  removeComment
} = require('../controllers')

commentsRouter.route('/:comment_id')
  .patch(voteOnComment)
  .delete(removeComment)

module.exports = commentsRouter;