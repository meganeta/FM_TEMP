let apply = document.getElementById('apply');
let reset = document.getElementById('reset');

var max_speed = document.getElementById('max_speed');
var max_client = document.getElementById('max_client');
var advanced = document.getElementById('advanced');
var password = document.getElementById('password');


window.onload = function() {
    max_speed.value = 0;
    max_client.value = 0;
    advanced.value = "0";
}

max_speed.oninput = function () {
    if (max_speed.value > 99 || max_speed.value < 0) {
        max_speed.value = 0;
    }
}

max_client.oninput = function () {
    if (max_client.value > 50 || max_client.value < 0) {
        max_client.value = 0;
    }
}

apply.onclick = function () {
    socket.send(String(max_speed.value) + "/" + String(max_client.value) + "/" + String(advanced.value) + "/" + String(password.value));
}

reset.onclick = function() {
    max_speed.value = 0;
    max_client.value = 0;
    advanced.value = "0";
    password.value = "";
}

var loc = window.location;
var socketURL = (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host;// + '/path';
var socket = new WebSocket(socketURL);


// WebSocket connection established
socket.onopen = function() {
console.log('Controller connected.');

// Send a message to the server
//socket.send('Hello, server!');
};

// Handle incoming messages from the server
socket.onmessage = function(event) {
var message = event.data;

console.log('Received message:', message);

if (+message) {
    window.alert("Settings Updated!");
} else {
    window.alert("Incorrect Password!");
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