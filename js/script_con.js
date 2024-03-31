let apply = document.getElementById('button');
let r1 = document.getElementById('1');
let r2 = document.getElementById('2');
let r3 = document.getElementById('3');
let r4 = document.getElementById('4');
let canvas = document.getElementById('canvasOutput');
let confirm = document.getElementById('confirm');

//generate sample bionic vision
function bionic_vision(w,h,hs,s) {
    //phosphene array size
    var width = w; //400/20
    var height = h; //300/20

    var width_ind = Math.floor(canvas.width/width);
    var height_ind = Math.floor(canvas.height/height);

    //phosphene half size
    var hsize = hs; //5
    //phosphene spacing should be larger than hsize * 2
    var spacing = s; //10

    //get geometry
    var top_ind = Math.floor((canvas.height - (height-1)*spacing)/2);
    var left_ind = Math.floor((canvas.width - (width-1)*spacing)/2);

    var i_ind = 0;
    var j_ind = 0;
    var ind_val = 0;

    let bv = new cv.Mat.zeros(canvas.height, canvas.width, cv.CV_8UC1);

    cv.imshow('canvasOutput', bv);

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            i_ind = top_ind + i*spacing;
            j_ind = left_ind + j*spacing;
            //ind_val = dstImage.ucharAt(i*height_ind,j*width_ind);
            for (var k = -hsize; k < hsize; k++) {
                for (var l = -hsize; l < hsize; l++) {
                    bv.ucharPtr(i_ind+k, j_ind+l)[0] = 255;
                }
            }
        }
    }

    cv.imshow('canvasOutput', bv);
    
}

cv['onRuntimeInitialized']=()=>{
    bionic_vision(40,30,3,10);
};

function hide_state(hide) {
    if (hide) {
        document.getElementById('wp').style.display = 'none';
        document.getElementById('hp').style.display = 'none';
        document.getElementById('hsp').style.display = 'none';
        document.getElementById('sp').style.display = 'none';
        document.getElementById('confirm').style.display = 'none';
    } else {
        document.getElementById('wp').style.display = 'block';
        document.getElementById('hp').style.display = 'block';
        document.getElementById('hsp').style.display = 'block';
        document.getElementById('sp').style.display = 'block';
        document.getElementById('confirm').style.display = 'block';
    }
}

var width = 0;
var height = 0;
var hsize = 0;
var spacing = 0;

confirm.onclick = function () {
    width = document.getElementById('w').value;
    height = document.getElementById('h').value;
    hsize = document.getElementById('hs').value;
    spacing = document.getElementById('s').value;

    bionic_vision(width,height,hsize,spacing);
}

r1.onclick = function () {
    hide_state(1);
    bionic_vision(12,9,10,30);
}

r2.onclick = function () {
    hide_state(1);
    bionic_vision(20,15,5,18);
}

r3.onclick = function () {
    hide_state(1);
    bionic_vision(40,30,3,10);
}

r4.onclick = function () {
    hide_state(0);
    bionic_vision(40,30,3,10);
}

var loc = window.location;
var socketURL = (loc.protocol === 'https:' ? 'wss://' : 'ws://') + loc.host;// + '/path';
var socket = new WebSocket(socketURL);

apply.onclick = function () {
    var num = document.querySelector('input[name="resolution"]:checked').value
    console.log("Resolution control")
    console.log(num);
    if (num == 1 || num == 2 || num == 3) {
        socket.send(num);
    } else if (num == 4) {
        socket.send(String(width) + "/" + String(height) + "/" + String(hsize) + "/" + String(spacing));
    }

    var num = document.querySelector('input[name="links"]:checked').value
    console.log("Link control");
    console.log(num);
    if (num == 5 || num == 6) {
        socket.send(num);
    }
}

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
};

// WebSocket connection closed
socket.onclose = function(event) {
console.log('WebSocket connection closed with code:', event.code);
};

// Handle errors
socket.onerror = function(error) {
console.error('WebSocket error:', error);
};