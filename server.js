/**
 * Configuration
 */

var express = require('express');
var path = require('path');
var config = require('./config').server;
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// Start server
var app = express();

// Paths
var staticPath = path.join(__dirname, '/' + config.path);

// Database
var db;

MongoClient.connect('mongodb://localhost:27017/todos', function(err,database) {
  if(err) return console.error(err);

  db = database;

  app.listen(config.port, function() {
    console.log('Listening on port ' + config.port);
  });
});

// Middleware
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
// We want to convert any request that is referencing a MongoDB ID
// to type ObjectID
app.use(function(req,res,next) {
  if(req.body && req.body.filter && req.body.filter._id) {
    req.body.filter._id = ObjectID(req.body.filter._id);
  }

  next();
});
// Check if we're toggling completion; if so find out
// what the existing property is and toggle it
app.use(function(req,res,next) {
  if(req.body && req.body.update && req.body.filter && req.body.update.toggleCompletion) {
    db.collection('todos').findOne(req.body.filter, function(err,result) {
      if(err) return console.error(err);

      req.body.update.isComplete = !result.isComplete;
      delete req.body.update.toggleCompletion; // Remove this before sending on.

      next();
    });
  } else {
    next();
  }
});

/**
 * Routes
 */

// Default route
app.get(function (req, res, next) {
  if (req.accepts('html')) res.sendFile(__dirname + '/index.html');
  else next();
});

// CRUD
app.get('/todos', function(req,res) {
  var cursor = db.collection('todos').find({}).toArray(function(err,result) {
    if(err) return console.error(err);

    console.log({ data: result }, 'get all request');
    res.json({data:result});
  });
});

app.get('/todos/query', function(req,res) {
  /*console.log('Url',req.url);
  console.log('Query parameters',req.query);
  console.log('Body',req.body);*/
  db.collection('todos').find(req.body.filter).toArray(function(err,result) {
    if(err) return console.error(err);

    //console.log({ data: result }, 'get request');
    res.json({data:result});
  });
});

app.post('/todos/add', function(req,res) {
  db.collection('todos').save(req.body.update, function(err,result) {
    if(err) return console.error(err);

    console.log(req.body.update,'saved to collection.');
    res.send(result);
  });
});

app.put('/todos/update', function(req,res) {
  // Need to convert ids to MongoDB ObjectID format
  // in order to match
  /*var _id = req.body._id;

  if(_id) {
    req.body._id = ObjectID(_id);
  }*/
  db.collection('todos').findOneAndUpdate(req.body.filter,req.body.update, function(err,result) {
    if(err) console.error(err);

    if(result.value) {
      console.log('Update successful',result.value);
    } else {
      console.log('Nothing updated');
    }

    res.send(result);
  });
});

app.delete('/todos/del', function(req,res) {
  // Need to convert ids to MongoDB ObjectID format
  // in order to match
  /*var _id = req.body._id;

  if(_id) {
    req.body._id = ObjectID(_id);
  }*/

  console.log('delete request body',req.body);
  db.collection('todos').findOneAndDelete(req.body.filter, function(err, result) {
      if(err) return console.error(err);

      if(result.value) {
        console.log(req.body.filter._id,'deleted');
      } else {
        console.log(req.body.filter._id,'not found');
      }
      res.send(result);
    });
});

app.delete('/todos/del/all', function(req,res) {
  console.log('clear database');
  db.collection('todos').deleteMany({}, function(err,result) {
    console.log('database cleared');
    res.send(result);
  });
});
