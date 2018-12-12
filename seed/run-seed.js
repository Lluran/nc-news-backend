const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('../config');
const devData = require('./devData');
const {
  seedDB
} = require('./seed');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
    return seedDB(devData)
  })
  .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
    console.log(`${topicDocs.length} <<< topics.  ${userDocs.length} <<< users.  ${articleDocs.length} <<< articles.  ${commentDocs.length} <<< comments.`);
    return mongoose.disconnect()
  })
  .then(() => {
    console.log(`Disconnected from ${DB_URL}`)
  })
  .catch(console.log)