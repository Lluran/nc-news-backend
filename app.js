const app = require('express')()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('./config');
const {
  apiRouter
} = require('./routes');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${DB_URL}.`)
  })
  .catch(console.log)

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({
    status: 404,
    msg: 'Page Not Found'
  })
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    err.status = 400
  }
  res.status(err.status).send({
    msg: err.message || err.msg
  })
});

module.exports = {
  app
};