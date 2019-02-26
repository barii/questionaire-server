const expect = require('expect');
const request = require('supertest');

const { MongoClient } = require('mongodb');
const { app } = require('../server');
const uuidv4 = require('uuid/v4');
 
 //const { Todo } = require('./../models/todo');
// const { User } = require('./../models/user');
const {populateQuestions} = require('./seed/seed');

let connection;
let db;

beforeEach(async (done) => {
  connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true } );
  db = await connection.db(global.__MONGO_DB_NAME__);
  //await populateQuestions(done, db);
  done();
});

afterEach(async () => {
  //await db.close();
  await connection.close();
});

describe('GET /users', () => {
  it('respond with json', (done) => {
    // the request-object is the supertest top level api
    request(app)
      .get('/api/questions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res).not.toBeNull();
      })
      .expect(200, done); // note that we're passing the done as parameter to the expect
  });
});


describe('POST /questions', () => {
  // var tests = [
  //   {args: [1, 2],       expected: 3},
  //   {args: [1, 2, 3],    expected: 6},
  //   {args: [1, 2, 3, 4], expected: 10}
  // ];

  // tests.forEach(function(test) {
  //   it('correctly adds ' + test.args.length + ' args', function() {
  //     var res = add.apply(null, test.args);
  //     assert.equal(res, test.expected);
  //   });
  // });


  it('should create a new open question', (done) => {
    uuid = uuidv4();
    const openQuestion = {
      id: uuid,
      type: "open",
      text: "haha",
      description: "desc"
    };

    request(app)
      .post('/api/questions/')
      //.set('x-auth', users[0].tokens[0].token)
      .set('Accept', 'application/json')
      .send(openQuestion)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(openQuestion.text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        db.collection('questions').findOne({id: uuid}, (err, res) => {
          if (err) return done(err);

          expect(res.text).toBe(openQuestion.text);
          done();
        });
      });
  });

  it('should create a new multichoice question', (done) => {
    uuid = uuidv4();
    const question = {
      id: uuid,
      type: "multichoice",
      text: "testMultichoiceQuestion",
      description: "testMultichoiceQuestionDescription",
      choices: [
        {'id': uuidv4(), 'value':'optnion1'},
        {'id': uuidv4(), 'value':'optnion2'}
      ]
    }

    request(app)
      .post('/api/questions/')
      //.set('x-auth', users[0].tokens[0].token)
      .set('Accept', 'application/json')
      .send(question)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(question.text);
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done(err);
        }

        db.collection('questions').findOne({id: uuid}, (err, res) => {
          if (err) return done(err);

          expect(res.text).toBe(question.text);
          done();
        });
      });
  });

//   it('should not create todo with invalid body data', (done) => {
//     request(app)
//       .post('/todos')
//       .set('x-auth', users[0].tokens[0].token)
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(2);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });

// describe('GET /todos', () => {
//   it('should get all todos', (done) => {
//     request(app)
//       .get('/api/questions/')
//       //.set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .expect((res) => {
//         console.log(res.body.questions);
//         expect(res.body.questions.length).toBe(1);
//       })
//       .end(done);
//   });
// });

// describe('GET /todos/:id', () => {
//   it('should return todo doc', (done) => {
//     request(app)
//       .get(`/todos/${todos[0]._id.toHexString()}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(todos[0].text);
//       })
//       .end(done);
//   });

//   it('should not return todo doc created by other user', (done) => {
//     request(app)
//       .get(`/todos/${todos[1]._id.toHexString()}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(404)
//       .end(done);
//   });

//   it('should return 404 if todo not found', (done) => {
//     var hexId = new ObjectID().toHexString();

//     request(app)
//       .get(`/todos/${hexId}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(404)
//       .end(done);
//   });

//   it('should return 404 for non-object ids', (done) => {
//     request(app)
//       .get('/todos/123abc')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(404)
//       .end(done);
//   });
// });

// describe('DELETE /todos/:id', () => {
//   it('should remove a todo', (done) => {
//     var hexId = todos[1]._id.toHexString();

//     request(app)
//       .delete(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo._id).toBe(hexId);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.findById(hexId).then((todo) => {
//           expect(todo).toNotExist();
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should remove a todo', (done) => {
//     var hexId = todos[0]._id.toHexString();

//     request(app)
//       .delete(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .expect(404)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.findById(hexId).then((todo) => {
//           expect(todo).toExist();
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should return 404 if todo not found', (done) => {
//     var hexId = new ObjectID().toHexString();

//     request(app)
//       .delete(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .expect(404)
//       .end(done);
//   });

//   it('should return 404 if object id is invalid', (done) => {
//     request(app)
//       .delete('/todos/123abc')
//       .set('x-auth', users[1].tokens[0].token)
//       .expect(404)
//       .end(done);
//   });
// });

// describe('PATCH /todos/:id', () => {
//   it('should update the todo', (done) => {
//     var hexId = todos[0]._id.toHexString();
//     var text = 'This should be the new text';

//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({
//         completed: true,
//         text
//       })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(text);
//         expect(res.body.todo.completed).toBe(true);
//         expect(res.body.todo.completedAt).toBeA('number');
//       })
//       .end(done);
//   });

//   it('should not update the todo created by other user', (done) => {
//     var hexId = todos[0]._id.toHexString();
//     var text = 'This should be the new text';

//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .send({
//         completed: true,
//         text
//       })
//       .expect(404)
//       .end(done);
//   });

//   it('should clear completedAt when todo is not completed', (done) => {
//     var hexId = todos[1]._id.toHexString();
//     var text = 'This should be the new text!!';

//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .send({
//         completed: false,
//         text
//       })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(text);
//         expect(res.body.todo.completed).toBe(false);
//         expect(res.body.todo.completedAt).toNotExist();
//       })
//       .end(done);
//   });
// });

// describe('GET /users/me', () => {
//   it('should return user if authenticated', (done) => {
//     request(app)
//       .get('/users/me')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body._id).toBe(users[0]._id.toHexString());
//         expect(res.body.email).toBe(users[0].email);
//       })
//       .end(done);
//   });

//   it('should return 401 if not authenticated', (done) => {
//     request(app)
//       .get('/users/me')
//       .expect(401)
//       .expect((res) => {
//         expect(res.body).toEqual({});
//       })
//       .end(done);
//   });
// });

// describe('POST /users', () => {
//   it('should create a user', (done) => {
//     var email = 'example@example.com';
//     var password = '123mnb!';

//     request(app)
//       .post('/users')
//       .send({email, password})
//       .expect(200)
//       .expect((res) => {
//         expect(res.headers['x-auth']).toExist();
//         expect(res.body._id).toExist();
//         expect(res.body.email).toBe(email);
//       })
//       .end((err) => {
//         if (err) {
//           return done(err);
//         }

//         User.findOne({email}).then((user) => {
//           expect(user).toExist();
//           expect(user.password).toNotBe(password);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should return validation errors if request invalid', (done) => {
//     request(app)
//       .post('/users')
//       .send({
//         email: 'and',
//         password: '123'
//       })
//       .expect(400)
//       .end(done);
//   });

//   it('should not create user if email in use', (done) => {
//     request(app)
//       .post('/users')
//       .send({
//         email: users[0].email,
//         password: 'Password123!'
//       })
//       .expect(400)
//       .end(done);
//   });
// });

// describe('POST /users/login', () => {
//   it('should login user and return auth token', (done) => {
//     request(app)
//       .post('/users/login')
//       .send({
//         email: users[1].email,
//         password: users[1].password
//       })
//       .expect(200)
//       .expect((res) => {
//         expect(res.headers['x-auth']).toExist();
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         User.findById(users[1]._id).then((user) => {
//           expect(user.tokens[1]).toInclude({
//             access: 'auth',
//             token: res.headers['x-auth']
//           });
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should reject invalid login', (done) => {
//     request(app)
//       .post('/users/login')
//       .send({
//         email: users[1].email,
//         password: users[1].password + '1'
//       })
//       .expect(400)
//       .expect((res) => {
//         expect(res.headers['x-auth']).toNotExist();
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         User.findById(users[1]._id).then((user) => {
//           expect(user.tokens.length).toBe(1);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });

// describe('DELETE /users/me/token', () => {
//   it('should remove auth token on logout', (done) => {
//     request(app)
//       .delete('/users/me/token')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         User.findById(users[0]._id).then((user) => {
//           expect(user.tokens.length).toBe(0);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
});