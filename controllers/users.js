const {
  User
} = require('../models')

exports.findUser = (req, res, next) => {
  const {
    username
  } = req.params;
  User.findOne({
      username: username
    })
    .then(user => {
      if (user === null) {
        return Promise.reject({
          status: 404,
          msg: `User not found for ${username}`
        })
      }
      res.status(200).send({
        user
      })
    })
    .catch(next)
}