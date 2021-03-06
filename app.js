var express = require('express');
var path = require('path');
var logger = require('morgan');
var fs = require('fs');

var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var CURRENT_POSITION = '0-0';
var CURRENT_DRAGGER = null;
try {
  CURRENT_POSITION = fs.readFileSync('LAST_POS').toString();
} catch(e) {}
var IS_BEING_DRAGGED_FOREIGN = false;

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
    position: CURRENT_POSITION.split('-')
  });
});

io.on('connection', function(socket){
  console.log('a user connected',socket.id);

  socket.on('initiate', function (msg) {
    socket.emit('initiate-response', {
      IS_BEING_DRAGGED_FOREIGN:IS_BEING_DRAGGED_FOREIGN,
      position:CURRENT_POSITION
    });
  })

  socket.on('coordinates', function(msg){
    if (socket.id != CURRENT_DRAGGER)
      return;
    console.log(msg);
    CURRENT_POSITION = msg;
    io.emit('coordinates', msg);
    fs.writeFileSync("LAST_POS", msg);
  });
  socket.on('start', function(msg){
    console.log(msg);
    io.emit('start', msg);
    IS_BEING_DRAGGED_FOREIGN = true;
    CURRENT_DRAGGER = socket.id;
  });
  socket.on('stop', function(msg){
    console.log(msg);
    CURRENT_POSITION = msg;
    io.emit('stop', msg);
    IS_BEING_DRAGGED_FOREIGN = false;
  });
  socket.on('ghost', function(msg) {
    // console.log(msg);
    io.emit('ghost',msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

