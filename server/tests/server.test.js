const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {testTodos, populateTodos,testUsers, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


describe("POST /todos tests", ()=>{
 
  it("should create a todo", (done)=>{
    let text = "Walk the dog";
    request(app)
     .post("/todos")
     .send({text})
     .expect(200)
     .expect(res=>{
       expect(res.body.text).toBe(text);
     })
     .end(err =>{
       if(err)
        return done(err);
      
       Todo.find()
        .then(todos => {
          expect(todos.length).toBe(3);
          expect(todos[2].text).toBe(text);
          done();
        })      
        .catch(e => done(e));
     })
  });

  it("should not create a todo with invalid body data",(done)=>{
    request(app)
     .post('/todos')
     .send({})
     .expect(400)
     .end(err =>{
       if(err)
        return done(err);

       Todo.find()
        .then(todos => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch(err => done(err));
     })
  });

});


describe("GET /todos", ()=>{
   
  it("should return all the todos",done=>{
     request(app)
      .get('/todos')
      .expect(200)
      .expect(res=>expect(res.body.todos.length).toBe(2))
      .end(done)
  });
});


describe("GET /todos/:id", ()=>{
 
  it('should return the todo doc', done=>{
    request(app)
     .get(`/todos/${testTodos[0]._id.toHexString()}`)
     .expect(200)
     .expect(res=>{
       expect(res.body.todo.text).toBe(testTodos[0].text);
     })
     .end(done);
  });

  it('should return 404 and proper error message for invalid id', done=>{
    request(app)
     .get(`/todos/123`)
     .expect(404)
     .expect(res => expect(res.body.message).toBe("Invalid todo Id"))
     .end(done);
  });

  it('should return 404 and proper error message if no todo found', done=>{
    request(app)
     .get(`/todos/${(new ObjectID()).toHexString()}`)
     .expect(404)
     .expect(res => expect(res.body.message).toBe("No todo exists with the given id"))
     .end(done);
  });
});


describe('DELETE /todos/:id',()=>{

  it('should delete the todo doc', done=>{
    let hexId = testTodos[0]._id.toHexString();
    request(app)
     .delete(`/todos/${hexId}`)
     .expect(200)
     .expect(res => {
       expect(res.body.todo._id).toBe(hexId);
     })
     .end(err =>{
       if(err)
        return done(err);
       
       Todo.findById(hexId)
        .then(todo=>{
          expect(todo).toNotExist();
          done();
        })
        .catch(e => done(e));
     });
  });

  it('should return 404 and proper error message for invalid id', done=>{
    request(app)
     .delete(`/todos/123`)
     .expect(404)
     .expect(res => expect(res.body.message).toBe("Invalid todo Id"))
     .end(done);
  });

  it('should return 404 and proper error message if no todo found', done=>{
    request(app)
     .delete(`/todos/${(new ObjectID()).toHexString()}`)
     .expect(404)
     .expect(res => expect(res.body.message).toBe("No todo exists with the given id"))
     .end(done);
  });
});

describe("PATCH /todos/:id",()=>{
  
  it("should update the todo", done =>{
    let hexId = testTodos[0]._id.toHexString();
    let data = {text: "Updated test task 1", completed: true};
    request(app)
     .patch(`/todos/${hexId}`)
     .send(data)
     .expect(200)
     .expect(res=>{
       expect(res.body.todo.text).toBe(data.text);
       expect(res.body.todo.completed).toBe(data.completed);
       expect(res.body.todo.completedAt).toBeA("number");
     })
     .end(done);
  });

  it("should clear completedAt when todo is not completed", done=>{
    let hexId = testTodos[1]._id.toHexString();
    let data = {text: "Updated test task 2", completed: false};
    request(app)
    .patch(`/todos/${hexId}`)
    .send(data)
    .expect(200)
    .expect(res=>{
      expect(res.body.todo.text).toBe(data.text);
      expect(res.body.todo.completed).toBe(data.completed);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});


describe("GET /users/me",()=>{
  
  it('should return the user if authenticated',done =>{
    request(app)
     .get('/users/me')
     .set('x-auth',testUsers[0].tokens[0].token)
     .expect(200)
     .expect(res=>{
       expect(res.body._id).toBe(testUsers[0]._id.toHexString());
       expect(res.body.email).toBe(testUsers[0].email);
     })
     .end(done);
  });

  it('should return 401 if not authenticated',done =>{
    request(app)
     .get('/users/me')
     .expect(401)
     .expect(res => expect(res.body).toEqual({}))
     .end(done);
  });
});

describe("POST /users", ()=>{
  it('should create a user', done=>{
    let requestBody = {
      "email": "test@gmail.com",
      "password": "test123"
     };
    request(app)
     .post('/users')
     .send(requestBody)
     .expect(200)
     .expect(res =>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(requestBody.email);
     })
     .end(err =>{
       if(err)
        return done(err);
      
       User.findOne({email:requestBody.email})
        .then(user => {
          expect(user).toExist();
          expect(user.password).toNotBe(requestBody.password);
          done();
        })
        .catch(e => done(e));
     });
  });

  it('should return validation error if request invalid', done => {
    let requestBody = {
      "email": "test@gmail.com",
      "password": "test"
     };
     request(app)
     .post('/users')
     .send(requestBody)
     .expect(400)
     .expect(res =>{
       expect(res.body._message).toEqual("User validation failed");
     })
     .end(done);
  });

  it('should not create user if email in use',done=>{
    let requestBody = {
      "email": testUsers[0].email,
      "password": "test123"
     };
     request(app)
     .post('/users')
     .send(requestBody)
     .expect(400)
     .expect(res =>{
       expect(res.body.name).toEqual("MongoError");
       expect(res.body.message).toEqual(`E11000 duplicate key error collection: TodoAppTest.users index: email_1 dup key: { : \"${requestBody.email}\" }`);
     })
     .end(done);
  });
});

describe('POST /users/login', ()=>{
   it('should login valid user and return auth token', done=>{
     request(app)
      .post('/users/login')
      .send({
        email : testUsers[1].email,
        password: testUsers[1].password
      })
      .expect(200)
      .expect(res=>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(testUsers[1].email);  
      })
      .end((err,res)=>{
        if(err)
         return done(err);
        
        User.findById(testUsers[1]._id)
         .then(user =>{
           expect(user.tokens[0]).toInclude({
             access : 'auth',
             token : res.headers['x-auth']
           });
           done();
         })
         .catch(e => done(e));       
      });
   });

   it('should reject invalid login', done=>{
     request(app)
      .post('/users/login')
      .send({
        email : testUsers[1].email,
        password: "incorrect_password"
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toNotExist();
        expect(res.body.message).toBe("Email or password is invalid");
      })
      .end((err,res)=>{
        if(err)
         return done(err);
        
        User.findById(testUsers[1]._id)
         .then(user =>{
           expect(user.tokens.length).toBe(0);
           done();
         })
         .catch(e => done(e));       
      });
   });
});

describe('DELETE /users/me/token',()=>{
  it('should remove token on logout',done =>{
    request(app)
     .delete('/users/me/token')
     .set('x-auth',testUsers[0].tokens[0].token)
     .expect(200)
     .end(err => {
       if(err)
        return done(err);

       User.findById(testUsers[0]._id)
        .then(user => {
          expect(user.tokens.length).toBe(0);
          done();
        })
        .catch(e => done(e));
     });
  });
});