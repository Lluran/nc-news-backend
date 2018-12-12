## NC_NEWS API
An API built using Express which interfaces with a mongodb using mongoose to allow users access to a series of articles, comments and user info.

### Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Database:

Ensure mongodb is installed using homebrew:

```
$ brew install mongodb
```


Dependencies:
```
    "body-parser": "^1.15.2",
    "express": "^4.16.3",
    "mongoose": "^5.3.10"
```

Dev-Dependencies:
```
    "chai": "^4.1.2",
    "mocha": "^5.0.5",
    "supertest": "^3.0.0",
    "nodemon": "^1.17.4"
```

## Installing

1. Fork and clone the depository from: https://github.com/Lluran/BE2-northcoders-news.git

2. Install dependencies by using the command:

```
$ npm i
```
3. Create a config.js file in the root directory. It should contain: 

```
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  test: 'mongodb://localhost:27017/nc_news_test',
  development: 'mongodb://localhost:27017/nc_news_dev'
}

module.exports = config[process.env.NODE_ENV];
```
4. Ensure mongodb is running in the background by writing the following command in a separate terminal:

```
$ mongod
```
5. To seed the database in dev-mode. Use the command:

```
$ npm run seed
```

6. Then start the server by running:

```
$ npm run dev
```

7. Simple use case: In your browser type http://localhost:9090/api - This should return information on all the available endpoints.

8. A live version of this app can be found here: https://ncnewsexpressmongodbapp.herokuapp.com/api 


## Running the tests
The API comes with a test environment able to test all endpoints and their associated errors.

To run the entire testing package, use the command:

```
$npm t
```

To run individual sections of the test use the .only extension to the relevant describe block within the index.spec.js. E.g.

```
describe.only('/users/:username', () => {
      it('GET returns status 200 and an object of user info', () => {
        return request
        .get(`/api/users/${userDocs[0].username}`)
        .expect(200)
        .then(({body: {comment}}) => {
          expect(comment.username).to.equal(`${userDocs[0].username}`)
        })
      });
    })
```

Each endpoint has its own test. E.g.

```
      it('PATCH returns status 200 and comment with new vote count', () => {
        return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then((res) => {
          expect(res.body.votes).to.equal(6)
        })
      });
```

Each endpoint also has associated error tests to handle fringe cases of API misuse. E.g.

```
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
          expect(res.body.msg).to.equal(`Comment not found for article ${wrongID}`)
         })
       });
```

## Deployment
You will need to seed the development data to mLab, and host the API on Heroku.

The config file will need to be amended to include a production key with the value of the mlab database url.

Similarly the app.js file will then need modifying to accept the mlab DB_URL.

## Built With
* Mongoose - The database modelling application
* Mongodb - the database storage
* Express - http API application
* Supertest - Testing suite for ASYNC applications
## Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning
We use gitHub for versioning. For the versions available, see the tags on this repository.

## Authors
* Aaron Boniface

See also the list of contributors who participated in this project.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments
* Northcoders - for their excellent teaching and guidance