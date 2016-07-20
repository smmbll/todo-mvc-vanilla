var express = require('express');
var path = require('path');
var config = require('./config');

var app = express();

// Urls
var staticPath = path.join(__dirname, '/public');
var npmPath = path.join(__dirname, '/node_modules');

// Serve static on all requests
app.use(express.static(staticPath));
app.get(function (req, res, next) {
  if (req.accepts('html')) res.sendFile(__dirname + '/index.html')
  else next()
});

// Make sure that we can access npm stuff on the front-end
app.use('/node_modules', express.static(npmPath));

app.listen(config.port, function() {
  console.log('Listening on port ' + config.port);
});
