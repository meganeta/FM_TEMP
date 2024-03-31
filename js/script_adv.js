let apply = document.getElementById('apply');
let reset = document.getElementById('reset');
let chart = document.getElementById('myChart');

window.onresize = function(){
    window.location.reload();
}

// Initial data for the chart
let initialData = {
    labels: ['0.0', '0.2', '0.4', '0.6', '0.8', '1.0', '1.2', '1.4', '1.6', '1.8'],
    datasets: [{
      label: '相对速度',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      fill: false,
    }]
  };
  
  // Configuration for the chart
  const config = {
    type: 'line',
    data: initialData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          color: "#f1f1f1",
          text: '动态自选波形'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            color: "#f1f1f1",
            text: '时间（秒）'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            color: "#f1f1f1",
            text: '相对速度（%）'
          },
          min:0,
          max:100
        }
  
      }
    },
  };
  
  // Create a new chart instance
  var myChart = new Chart(chart, config);
  
  var isDragging = false;
  var sel_point = false;
  var dataIndex = 0;
  var mouseY_init = 0;
  var init_data = 0;
  var dynamic_factor = 0.5;
  
  function drag_start(event){
    console.log("down");
    isDragging = true;
  }
  
  function drag_end(event){
    console.log("up");
    isDragging = false;
    sel_point = false;
  }
  
  function dragging(event){
    console.log("move");
    if (isDragging) {
      if (!sel_point) {
        let mouseX = event.clientX - this.getBoundingClientRect().left;
        mouseY_init = event.clientY;
        let chartArea = myChart.chartArea;
        dataIndex = Math.floor((mouseX / this.getBoundingClientRect().width) * myChart.data.datasets[0].data.length);
        if (dataIndex < myChart.data.datasets[0].data.length) {
          sel_point = true;
          init_data = myChart.data.datasets[0].data[dataIndex];
        }

        dynamic_factor = 150/(this.getBoundingClientRect().height);

      } else {
        let mouseY = event.clientY;
        // Update data point value if within range
        var value = Math.round((mouseY_init - mouseY)*dynamic_factor + init_data);
        if (value > 100) {
          value = 100;
        } else if (value < 0) {
          value = 0;
        }
        myChart.data.datasets[0].data[dataIndex] = value;
        myChart.update();

        console.log(value);
      }
    }
  }
  
  // Add event listeners for mouse and touch interactions
  chart.addEventListener('mousedown', drag_start);
  chart.addEventListener('mousemove', dragging);
  chart.addEventListener('mouseup', drag_end);
  chart.addEventListener('mouseleave', drag_end);

  chart.addEventListener('touchstart', drag_start);
  chart.addEventListener('touchmove', dragging);
  chart.addEventListener('touchend', drag_end);
  

apply.onclick = function () {
    socket.send("chart" + "/" + myChart.data.datasets[0].data);
}

reset.onclick = function() {
    myChart.data.datasets[0].data[dataIndex] = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
    myChart.update();
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

    var res = message.split("/");

    if (res.length == 2) {
        // Process the message or perform any desired action
        if (res[0] == "chart" && +res[1]) {
            window.alert("Wave Updated!");
        } else {
            window.alert("Incorrect Wave!");
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