const testData = require('../seed/testData');
process.env.NODE_ENV = 'test';
process.env.DATA = testData;
const {
  app
} = require('../app')
const request = require('supertest')(app)
const {
  expect
} = require('chai');
const {
  seedDB
} = require('../seed/seed')
const mongoose = require('mongoose');

describe('/api', () => {

  let topicDocs, articleDocs, userDocs, commentDocs, wrongID = mongoose.Types.ObjectId();

  beforeEach(() => {
    return seedDB(testData).then(docs => {
      [topicDocs, userDocs, articleDocs, commentDocs] = docs;
    })
  });

  after(() => {
    return mongoose.disconnect();
  });

  it('GET returns status code 200 and html document', () => {
    return request
      .get('/api')
      .expect(200)
      .then(res => {
        expect(res.headers['content-type']).to.equal('text/html; charset=UTF-8')
      })
  });
  it('GET for an invalid address returns status 404 and error message', () => {
    return request
      .get('/banana')
      .expect(404)
      .then(res => {
        expect(res.body.msg).to.equal('Page Not Found');
      })
  });

  describe('/topics', () => {
    it('GET returns status 200 and an object contianing an array of all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({
          body: {
            topics
          }
        }) => {
          expect(topics.length).to.equal(topicDocs.length);
          expect(topics[0].title).to.equal(topicDocs[0].title)
          expect(topics[0].slug).to.equal(topicDocs[0].slug)
        })
    });
  });

  describe('/topics/:topic_slug/articles', () => {
    it('GET returns status 200 and an array of articles relating to a given topic', () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .expect(200)
        .then((res) => {
          expect(res.body.articles.length).to.equal(2)
          expect(res.body.articles[0].title).to.equal(articleDocs[0].title)
        })
    });
    it('GET for an invalid topic slug return status 400 and an error message', () => {
      return request
        .get(`/api/topics/banana/articles`)
        .expect(400)
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body.msg).to.equal('Articles not found for topic: banana')
        })
    });
    it('POST returns the new article which has been added to the database and status code 201', () => {
      const newArticle = {
        "title": "new article",
        "body": "This is my new article content",
        "created_by": `${userDocs[0]._id}`
      }
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
        .send(newArticle)
        .expect(201)
        .then(({
          body: {
            insertedArticle
          }
        }) => {
          expect(insertedArticle.title).to.equal(newArticle.title)
          expect(typeof insertedArticle._id).to.not.equal('undefined')
        })
    });
    it('POST with an inproperly formatted object will return status 400 and an error message', () => {
      const newComment = {
        "title": "new article",
        "created_by": `${userDocs[0]._id}`
      }
      return request
        .post(`/api/topics/${topicDocs[0].slug}/articles`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.status).to.equal(400)
          expect(res.body.msg).to.equal('articles validation failed: body: Path `body` is required.')
        })
    });
  });
  describe('/articles', () => {
    it('GET returns status 200 and an array of all articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({
          body: {
            articles
          }
        }) => {
          expect(articles.length).to.equal(articleDocs.length)
          expect(articles[0].body).to.equal(articleDocs[0].body)
        })
    });
  });

  describe('/articles/:article_id', () => {
    it('GET returns status 200 and an article matching given ID', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(({
          body: {
            article
          }
        }) => {
          expect(article._id).to.equal(`${articleDocs[0]._id}`)
        })
    });
    it('GET for an invalid ID return status 400 and an error message', () => {
      return request
        .get(`/api/articles/123`)
        .expect(400)
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "123" at path "_id" for model "articles"`)
        })
    });
    it('GET for a valid ID not in the collection returns status 404 and an error message', () => {
      return request
        .get(`/api/articles/${wrongID}`)
        .expect(404)
        .then(res => {
          expect(res.status).to.equal(404)
          expect(res.body.msg).to.equal(`Article not found for ${wrongID}`)
        })
    });
    it('PATCH returns status 200 and article with new vote count', () => {
      return request
        .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
        .expect(200)
        .then((res) => {
          expect(res.body.article.votes).to.equal(1)
        })
    });
    it('PATCH for an invalid ID return status 400 and an error message', () => {
      return request
        .patch(`/api/articles/123?vote=up`)
        .expect(400)
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "123" at path "_id" for model "articles"`)
        })
    });
    it('PATCH for a valid ID not in the collection returns status 404 and an error message', () => {
      return request
        .patch(`/api/articles/${wrongID}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.status).to.equal(404)
          expect(res.body.msg).to.equal(`Article not found for article: ${wrongID}`)
        })
    });
  });

  describe('/articles/:article_id/comments', () => {
    it('GET returns status 200 and array of relevant comments', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}/comments`)
        .expect(200)
        .then(({
          body: {
            comments
          }
        }) => {
          expect(comments.length).to.equal(2)
          expect(comments[0].belongs_to.title).to.equal(articleDocs[0].title)
        })
    });
    it('GET for an invalid ID return status 400 and an error message', () => {
      return request
        .get(`/api/articles/123/comments`)
        .expect(400)
        .then((res) => {
          expect(res.status).to.equal(400)
          expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "123" at path "belongs_to" for model "comments"`)
        })
    });
    it('GET for a valid ID not in the collection returns status 404 and an error message', () => {
      return request
        .get(`/api/articles/${wrongID}/comments`)
        .expect(404)
        .then(res => {
          expect(res.status).to.equal(404)
          expect(res.body.msg).to.equal(`Comment not found for article ${wrongID}`)
        })
    });
    it('POST returns status 201 and successfully posted comment', () => {
      const newComment = {
        "body": "This is my new comment",
        "created_by": `${userDocs[0]._id}`
      }
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({
          body: {
            comment
          }
        }) => {
          expect(comment.created_by.username).to.equal(userDocs[0].username)
        })
    });
    it('POST with an inproperly formatted object will return status 400 and an error message', () => {
      const newComment = {
        "created_by": `${userDocs[0]._id}`
      }
      return request
        .post(`/api/articles/${articleDocs[0]._id}/comments`)
        .send(newComment)
        .expect(400)
        .then(res => {
          expect(res.status).to.equal(400)
          expect(res.body.msg).to.equal('comments validation failed: body: Path `body` is required.')
        })
    });
  });

  describe('/comments', () => {
    describe('/comments/:comment_id', () => {
      it('PATCH returns status 200 and comment with new vote count', () => {
        return request
          .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
          .expect(200)
          .then((res) => {
            expect(res.body.comment.votes).to.equal(6)
          })
      });
      it('PATCH for an invalid ID return status 400 and an error message', () => {
        return request
          .patch(`/api/comments/123`)
          .expect(400)
          .then((res) => {
            expect(res.status).to.equal(400)
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "123" at path "_id" for model "comments"`)
          })
      });
      it('PATCH for a valid ID not in the collection returns status 404 and an error message', () => {
        return request
          .patch(`/api/comments/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.status).to.equal(404)
            expect(res.body.msg).to.equal(`Comment not found for comment: ${wrongID}`)
          })
      });
      it('DELETE returns status 202 and the removed comment', () => {
        return request
          .delete(`/api/comments/${commentDocs[0]._id}`)
          .expect(202)
          .then(({
            body: {
              comment
            }
          }) => {
            expect(comment._id).to.equal(`${commentDocs[0]._id}`)
          })
      });
      it('DELETE for an invalid ID return status 400 and an error message', () => {
        return request
          .delete(`/api/comments/123`)
          .expect(400)
          .then((res) => {
            expect(res.status).to.equal(400)
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "123" at path "_id" for model "comments"`)
          })
      });
      it('DELETE for a valid ID not in the collection returns status 404 and an error message', () => {
        return request
          .delete(`/api/comments/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.status).to.equal(404)
            expect(res.body.msg).to.equal(`Comment not found for comment ${wrongID}`)
          })
      });
    });
  });
  describe('/users', () => {
    describe('/users/:username', () => {
      it('GET returns status 200 and an object of user info', () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(({
            body: {
              user
            }
          }) => {
            expect(user.username).to.equal(`${userDocs[0].username}`)
          })
      });
      it('GET for an valid username not in the collection returns status 404 and an error message', () => {
        return request
          .get(`/api/users/123`)
          .expect(404)
          .then((res) => {
            expect(res.status).to.equal(404)
            expect(res.body.msg).to.equal(`User not found for 123`)
          })
      });
    });
  });
});