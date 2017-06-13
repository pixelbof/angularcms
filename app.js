var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();    

var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/houseology');
var db = mongoose.connection;

var api = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser('houseology'));
app.use (session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/', index);
app.use('/users', users);

var usersList = [];
var currentUser = '';

var remove = function(elem) {
  var arr = usersList;
  var index = arr.indexOf(elem);
  if (index >= 0) {
    arr.splice( index, 1 );
  }
}  

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { id: socket.id });

    socket.on('newUser', function(data) {
      currentUser = data.username;

      if(contains.call(usersList, currentUser) != true && currentUser != null) {
        usersList.push(currentUser);
      } else {
        console.log("same user detected")
        socket.emit('disconnect')
      }

      io.sockets.emit('addUserToList', usersList);
    });

    socket.on('newMessage', function(data) {
      io.sockets.emit('messageRecieve', data.message)
    });

    socket.on('disconnect', function() {
      if (io.sockets.connected[socket.id]) {
          io.sockets.emit('messageRecieve', currentUser + " Has been disconnected from the chat server, reason : too many open connections, refresh this page to start chatting")
          io.sockets.connected[socket.id].disconnect();
      }

      if(currentUser !== undefined) {
        socket.broadcast.emit('messageRecieve', currentUser + " has disconnected!");
      }

      if(contains.call(usersList, currentUser) == true) {
        remove(currentUser);
      }
      
      io.sockets.emit('addUserToList', usersList);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
