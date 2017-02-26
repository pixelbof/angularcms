// export function for listening to the socket
module.exports = function (socket) {
  //get username cookie
  var name;
  

  socket.on('getUsername', function(data) {
   name = data.name;
  })

  function globalName(name) {
    name = name;  // it also displays 2
    console.log(name)
  }

  // notify other clients that a new user has joined
  socket.emit('user:join', {
    user: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.message
    });
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
  });
};