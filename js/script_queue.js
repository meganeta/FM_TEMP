let connect = document.getElementById('connect');

let light = document.getElementById('light');
let moderate = document.getElementById('moderate');
let strong = document.getElementById('strong');
let brutal = document.getElementById('brutal');

var user_count = document.getElementById('user_count');
var client_id = document.getElementById('client_id');

var username = "变态";

client_id.oninput = function () {
    if (client_id.value.length > 6) {
        window.alert("用户名过长！")
        client_id.value = "";
    }
}

function addRow(name,mode,time) {
    var table = document.getElementById("exec_table").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    cell1.innerHTML = String(name);
    cell2.innerHTML = String(mode);
    cell3.innerHTML = String(time);
}

function deleteRow(row_num){
    var table = document.getElementById("exec_table");
    table.deleteRow(rowNumber);
}

light.onclick = function(){
    if(client_id.value.length>0){
        username = client_id.value;
    }
}

moderate.onclick = function(){
    if(client_id.value.length>0){
        username = client_id.value;
    }

    
}

strong.onclick = function(){
    if(client_id.value.length>0){
        username = client_id.value;
    }


}

brutal.onclick = function(){
    if(client_id.value.length>0){
        username = client_id.value;
    }


}

var loc = window.location;
var socketURL = (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host;// + '/path';
var socket = new WebSocket(socketURL);

// WebSocket connection established
socket.onopen = function() {
    console.log('Controller connected.');

    // Send a message to the server
    socket.send("con");
};

// Handle incoming messages from the server
socket.onmessage = function(event) {
    var message = event.data;

    console.log('Received message:', message);

    var res = message.split("/");

    if (res.length == 1) {
        if(+res[0] == 1) {
            connect.innerText = "已连接";
            con_status = true;
        } else {
            connect.innerText = "未连接";
            con_status = false;
        }
    }

    if (res.length == 2) {
        // Process the message or perform any desired action
        if (res[0] == "set" && +res[1]) {
            window.alert("Settings Updated!");
        } else {
            window.alert("Incorrect Password!");
        }
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