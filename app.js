var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// development error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

app.get('/', function(req, res){
  res.render('index', {
    rows: 10,
    columns: 10,
    position: [0,0]
  });
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('coordinates', function(msg){
    console.log(msg);
    io.emit('coordinates', msg);
  });



});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

