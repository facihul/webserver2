
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNestID = 1;
app.use(bodyParser.json());
var todos = [];
// {
// 	id: 1,
// 	description : 'Meet me for launch',
// 	completed: false 
// }, {
//   id: 2,  
//   description : 'Meet me for dinner',
//   completed: false 

// },
// {
//   id: 3,  
//   description : 'feed farhan',
//   completed: false 
// }];
app.get('/', function (req,res){
 
   res.send('Todo api root');
});


app.get('/todos', function(req, res){
	res.json(todos);

});

app.get('/todos/:id', function(req, res){
	var match;
    var todoId = parseInt(req.params.id,10);
    todos.forEach(function(todo){
     if (todoId === todo.id) {
      match = todo;
     };
    });

    if (match) {
    	res.json(match);
    }else{
    	res.status(404).send();
    }

});

app.post('/todos', function(req, res){

  var body = req.body;
  body.id = todoNestID++;
  todos.push(body);

  console.log('description' + body.description);
  res.json(body);
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
} );