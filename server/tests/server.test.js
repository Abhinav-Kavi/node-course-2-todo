const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let testTasks = [{
	"text": "test task 1"
},
{
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
