const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let testTasks = [{
  _id : new ObjectID(),
	"text": "test task 1"
},
{
  _id : new ObjectID(),
	"text": "test task 2"
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(testTasks);    
  }).then(()=> done());
})

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
     .end((err,res)=>{
       if(err)
        return done(err);
      
       Todo.find({text})
        .then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
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
     .end((err,res)=>{
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
     .get(`/todos/${testTasks[0]._id.toHexString()}`)
     .expect(200)
     .expect(res=>{
       expect(res.body.todo.text).toBe(testTasks[0].text);
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