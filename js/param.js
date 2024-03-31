var speed = 0;
/*
mode 
0: static
1: sine
2: rec
4: custom
*/
var mode = 0;

var loc = window.location;
var socketURL = (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host;

var socket = new WebSocket(socketURL);

// WebSocket connection established
socket.onopen = function() {
    console.log('WebSocket connection established.');
  
    // Send a message to the server
    //socket.send('Hello, server!');
  };

// Handle incoming messages from the server
socket.onmessage = function(event) {
    var message = event.data;
    console.log('Received message:', message);

    var res = message.split("/");
    
    if (res.length == 4) {
        // Process the message or perform any desired action
        width = res[0];
        height = res[1];
        hsize = res[2];
        spacing = res[3];

        socket.send(res);
    }
};
  
// WebSocket connection closed
socket.onclose = function(event) {
    console.log('WebSocket connection closed with code:', event.code);
};

// Handle errors
socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};