const usersRouter = require('express').Router();

const {
  findUser
} = require('../controllers')

usersRouter.route('/:username')
  .get(findUser)

module.exports = usersRouter;