import openSocket from 'socket.io-client';
import {
  endpointIP,
  endpointPort
} from './resources.js'


var connectSocket = (jwtToken) => {
  const socket = openSocket('http://' + endpointIP + ':' + endpointPort, {
    'query': 'token=' + jwtToken
  });
  socket.on('connected', function(socket) {
    console.log('[Socket.io] Connected');
  });

  socket.on('connect', function() {
    console.log('[Socket.io] Connecting ....');
  });

  return socket;
};

// var socket = io.connect('http://' + endpointIP + ':' + endpointPort, {
//   'query': 'token=' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImEiLCJfaWQiOiI1YzFmZGMxNjEyMmViMjNjYWE0OTg1MGYiLCJpYXQiOjE1NDU2MDE2NjEsImV4cCI6MTU0NTY4ODA2MX0.ZqBy-VX9A9j5txrpXSuDT522oCgAULSHPhIi8t8LcKM'
//   // 'query': 'token=' + 'test'
// });

// var socket = io.connect('http://' + endpointIP + ':' + endpointPort);
// socket.on('connect', function() {
//   socket
//     .emit('authenticate', {
//       token: jwtToken
//     }) //send the jwt
//     .on('authenticated', function() {
//       console.log('authenticated !!!');
//     })
//     .on('unauthorized', function(msg) {
//       console.log("unauthorized: " + JSON.stringify(msg.data));
//       throw new Error(msg.data.type);
//     })
// });

// const socket = openSocket('http://' + endpointIP + ':' + endpointPort);

export {
  connectSocket
};