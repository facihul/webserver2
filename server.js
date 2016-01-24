var bodyParser = require('body-parser');
var express = require('express');
var _ = require('underscore');
var db = require('./db.js')
var becrypt = require('bcrypt');
var app = express();
var PORT = process.env.PORT || 3000;
var todoNestID = 1;
app.use(bodyParser.json());
var todos = [];

// GET data 
app.get('/', function(req, res) {

  res.send('Todo api root');
});


app.get('/todos', function(req, res) {
  var queryParams = req.query;
  var where = {};
  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    where.completed = true;
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    where.completed = false;
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    where.description = {
      $like: '%' + queryParams.q + '%'
    };
  }
  db.todo.findAll({
    where: where
  }).then(function(todos) {
    res.json(todos);
  }, function(e) {
    res.status(500).send();
  });


  // old version without sqlite database
  /*
     var filteredTodos = todos;
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
      filteredTodos = _.where(filteredTodos, {
        completed: true
      });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
      filteredTodos = _.where(filteredTodos, {
        completed: false
      });
    }
    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
      filteredTodos = _.filter(filteredTodos, function(todo) {
        return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
      });
    }
    res.json(filteredTodos);

    */

});

app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.findById(todoId).then(function(todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function(e) {
    res.status(500).send();
  });
  // // old version without sqlite database
  /*
        // var match = _.findWhere(todos, {
        //   id: todoId
        // });


        // if (match) {
        //   res.json(match);
        // } else {
        //   res.status(404).send();
        // }
 */
});

// POST data 
app.post('/todos', function(req, res) {

  var body = _.pick(req.body, 'description', 'completed');
  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());

  }, function(e) {
    res.status(400).json(e);
  });

  // // old version without sqlite database
  /*
    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //   return res.status(404).send();
    // };
    // body.description = body.description.trim();

    // body.id = todoNestID++;
    // todos.push(body);

    // console.log('description' + body.description);
    // res.json(body);*/
});


// Delet data

app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No todo with id'
      });
    } else {
      res.status(204).send();
    }
  }, function() {
    res.status(500).send();
  });

  // old version without sqlite database
  /*
  var match = _.findWhere(todos, {
    id: todoId
  });

  if (!match) {
    res.status(404).json({
      "error": "Id not found"
    });
  } else {
    todos = _.without(todos, match);
    res.json(match);
  }
  */

});

// Update data

app.put('/todos/:id', function(req, res) {

  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};

  if (body.hasOwnProperty("completed")) {
    attributes.completed = body.completed;
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;

  }

  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
      return todo.update(attributes);
    } else {
      res.status(404).send();
    }
  }, function() {
    res.status(500).send();
  }).then(function(todo) {
    res.json(todo.toJSON());
  }, function(e) {
    res.status(e).send();
  });
});



// old version without sqlite database
/*
  var match = _.findWhere(todos, {
    id: todoId
  });
  var body = _.pick(req.body, 'description', 'completed');
  var validatt = {};
  if (!match) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
    validatt.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validatt.description = body.description;

  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(match, validatt);
  res.json(match);
*/

app.post('/user', function(req, res) {

  var body = _.pick(req.body, 'email', 'password');
  db.user.create(body).then(function(user) {
    res.json(user.toPublicJSON());

  }, function(e) {
    res.status(400).json(e);
  });
});

// psot(/user/login)
app.post('/user/login', function(req, res) {
  var body = _.pick(req.body, 'email', 'password');
  db.user.authenticate(body).then(function (user){
   res.header('Auth',user.generateToken('authenticate')).json(user.toPublicJSON());
  }, function (){
   res.status(401).send();
  });

});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
  });


});