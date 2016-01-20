
var bodyParser = require('body-parser');
var express = require('express');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNestID = 1;
app.use(bodyParser.json());
var todos = [];

// GET data 
app.get('/', function (req,res){
 
   res.send('Todo api root');
});


app.get('/todos', function(req, res){
	res.json(todos);

});

app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id,10);
    var match = _.findWhere(todos,{id: todoId});
    

    if (match) {
    	res.json(match);
    }else{
    	res.status(404).send();
    }

});
// POST data 
app.post('/todos', function(req, res){

  var body = _.pick(req.body, 'description', 'completed');
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
  	return res.status(404).send();
  };
  body.description = body.description.trim();

  body.id = todoNestID++;
  todos.push(body);

  console.log('description' + body.description);
  res.json(body);
});

// Delet data

app.delete('/todos/:id',function (req, res){
  var todoId = parseInt(req.params.id, 10);
  var match = _.findWhere(todos, {id: todoId});
  
   if (!match) {
   	res.status(404).json({"error": "Id not found" });
   }else {
   	todos = _.without(todos,match);
   	res.json(match);
   }

});


app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
} );




