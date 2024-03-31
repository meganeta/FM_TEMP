var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/cert/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var express = require('express');
const app = express();

app.use(express.static(__dirname + '/'));

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
const secserver = https.createServer(credentials, app);

const WebSocket = require('ws');
// Create WebSocket server
const wss = new WebSocket.Server({ server: secserver });
//const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

var line_saved = "40/30/3/10";
var link_state = '0';
var connectedClient = []; // Store the connected client

// WebSocket connection handling
wss.on('connection', function connection(ws) {

  connectedClient.push(ws); // Store the connected client when a connection is established

  // Handle incoming WebSocket messages
  ws.on('message', function incoming(message) {
    console.log('Received message:', String(message));

    message = String(message);

    if (message == '1' || message == '2' || message == '3') {
      switch (message) {
        case '1':
          line_saved = "12/9/10/30";
          break;
        case '2':
          line_saved = "20/15/5/18";
          break;
        case '3':
          line_saved = "40/30/3/10";
          break;
      }

      if (connectedClient.length) {
        console.log(connectedClient.length);
        console.log('Send message:', String(line_saved));
        connectedClient.forEach(function(client) {
          client.send(line_saved);
        });
        
      } else {
        console.log('No client connected.');
      }
    }else if (message == '4') {
      var res = message.split("/");
      if (res.length == 4) {
        line_saved = message;
        if (connectedClient.length) {
          console.log(connectedClient.length);
          console.log('Send message:', String(line_saved));
          connectedClient.forEach(function(client) {
            client.send(line_saved);
          });
          
        } else {
          console.log('No client connected.');
        }
      }
    } else if (message == '5' || message == '6') {
      if (message == '5') {
        link_state = 1;
      } else {
        link_state = 0;
      }

      if (connectedClient.length) {
        console.log(connectedClient.length);
        console.log('Send message:', String(link_state));
        connectedClient.forEach(function(client) {
          client.send(link_state);
        });
        
      } else {
        console.log('No client connected.');
      }
    }

    // Send a response back to the client
    //ws.send(line_saved);
    
  });

  // Handle WebSocket connection close
  ws.on('close', function close() {
    const index = connectedClient.indexOf(ws); // Clear the stored client when the connection is closed
    if (index > -1) { // only splice array when item is found
      connectedClient.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log('WebSocket',String(index),' connection closed');
  });


  ws.send(line_saved);

  /*
  // Send a greeting message to the newly connected client
  ws.send('Welcome to the WebSocket server!');
  */
});



var os = require('os');
var allNetworkInterfaces = os.networkInterfaces();


secserver.listen(process.env.PORT || 3000,function() {
  console.log("Server created!");
  console.log(allNetworkInterfaces);
  console.log('WebSocket server is listening on port: '+ String(process.env.PORT || 3000));
  console.log('Type Width/Height/Hsize/Spacing to change bionic vision layout!');
  console.log('Bionic 99: 12/9/10/30');
  console.log('Coarse: 20/15/5/18');
  console.log('Med fine: 40/30/3/10');
  console.log('Med fine: 40/30/3/10');
});


var readline = require('readline');

// Create a readline interface for reading from the server console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Read input from the server console and send it to the client
rl.on('line', function onLine(line) {
  line_saved = line;

  if (connectedClient.length) {
    console.log(connectedClient.length);
    console.log('Send message:', String(line));
    connectedClient.forEach(function(client) {
      client.send(line);
    });
    
  } else {
    console.log('No client connected.');
  }

});

/*
openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 -nodes -subj "/C=US/ST=Oregon/L=Portland/O=Company Name/OU=Org/CN=www.example.com" -keyout server.key -out server.crt -subj "//CN=server.com" -addext "subjectAltName=DNS:server.com,DNS:www.server.net,IP:10.17.53.49"
  */