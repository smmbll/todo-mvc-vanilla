'use strict';
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
    next(); // We need to make sure that next() isn't called until
            // databasing operations are finished; but if no parameters
            // are supplied in req.filter and req.update, we still
            // need to call next().
  }
});
// Query types need to be cast correctly
app.use(function(req,res,next) {
  var query = req.query;

  if(query && typeof query === 'object' && Object.keys(query).length) {
    for(var param in query) {
      var value = query[param];
      var valueToFloat = parseFloat(value);

      if(!isNaN(valueToFloat)) { // Cast to numbers
        query[param] = valueToFloat;
      } else if(value === 'true') { // Cast to bools
        query[param] = true;
      } else if(value === 'false') {
        query[param] = false;
      }
    }
  }

  next();
});

/**
 * Routes
 */

// Default route
app.get(function (req, res, next) {
  if (req.accepts('html')) res.sendFile(__dirname + '/index.html');
  else next();
});

// READ
app.get('/todos', function(req,res) {
  var query = req.query;
  var searchPattern = Object.keys(query).length ? query : {};

  db.collection('todos').find(searchPattern).toArray(function(err,result) {
    if(err) return console.error(err);

    console.log('/todos request successful');
    res.json({items:result});
  });
});

// CREATE
app.post('/todos/add', function(req,res) {
  db.collection('todos').save(req.body.update, function(err,result) {
    if(err) return console.error(err);

    console.log('/todos/add request successful');
    res.send(result);
  });
});

// UPDATE
app.put('/todos/update', function(req,res) {
  db.collection('todos').findOneAndUpdate(req.body.filter,{ $set: req.body.update }, function(err,result) {
    if(err) console.error(err);

    if(result.value) {
      console.log('todos/update request successful, update',result.value);
    } else {
      console.log('todos/update request successful no update');
    }

    // Return updated properties
    res.send(req.body.update);
  });
});

// DELETE
app.delete('/todos/del', function(req,res) {
  db.collection('todos').findOneAndDelete(req.body.filter, function(err, result) {
      if(err) return console.error(err);

      if(result.value) {
        console.log('todos/del',req.body.filter._id,'deleted');
      } else {
        console.log('todos/del',req.body.filter._id,'not found');
      }

      res.send(result);
    });
});

// DELETE ALL
app.delete('/todos/del/all', function(req,res) {
  db.collection('todos').deleteMany({}, function(err,result) {
    console.log('/todos/del/all request successful');
    res.send(result);
  });
});
