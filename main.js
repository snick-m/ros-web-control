// Connecting to ROS
// -----------------

var ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
});

ros.on('connection', function () {
    console.log('Connected to websocket server.');
});

ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function () {
    console.log('Connection to websocket server closed.');
});

// Handling Control Form Submit
// ----------------------------

var controlForm = document.getElementById('control-form');
controlForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var linearX = document.getElementById('linearx').value;
    var linearY = document.getElementById('lineary').value;
    var linearZ = document.getElementById('linearz').value;
    var angularX = document.getElementById('angularx').value;
    var angularY = document.getElementById('angulary').value;
    var angularZ = document.getElementById('angularz').value;

    var twist = new ROSLIB.Message({
        linear: {
            x: parseFloat(linearX),
            y: parseFloat(linearY),
            z: parseFloat(linearZ)
        },
        angular: {
            x: parseFloat(angularX),
            y: parseFloat(angularY),
            z: parseFloat(angularZ)
        }
    });
    cmdVel.publish(twist);
});

// Handling Keyboard Control
// -------------------------

var keyMap = {
    'left': { // left
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 1
        }
    },
    'up': { // up
        linear: {
            x: 1,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    'right': { // right
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: -1
        }
    },
    'down': { // down
        linear: {
            x: -1,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    }
};

let activeKeys = new Set();

document.addEventListener('keydown', function (e) {
    if (e.key.slice(0, 5) !== 'Arrow') return;
    e.preventDefault();
    stopped = false;
    activeKeys.add(e.key.slice(5).toLowerCase());
});

document.addEventListener('keyup', function (e) {
    activeKeys.delete(e.key.slice(5).toLowerCase());
});

let stopped = true;

setInterval(function () { // Periodic sending of Keyboard Control every 100ms
    var twist = new ROSLIB.Message({
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    });

    // Displaying the active keys
    document.getElementById("controlKeys").innerHTML = "( " + Array.from(activeKeys).join(', ') + " )";

    activeKeys.forEach(function (key) { // Combine Multiple Buttons
        twist.linear.x += keyMap[key].linear.x;
        twist.linear.y += keyMap[key].linear.y;
        twist.linear.z += keyMap[key].linear.z;
        twist.angular.x += keyMap[key].angular.x;
        twist.angular.y += keyMap[key].angular.y;
        twist.angular.z += keyMap[key].angular.z;
    });

    // Stop sending if no keys are pressed
    if (twist.linear.x === 0 && twist.linear.y === 0 && twist.linear.z === 0 && twist.angular.x === 0 && twist.angular.y === 0 && twist.angular.z === 0) {
        if (!stopped) {
            stopped = true;
            console.log('Stopped');
        } else {
            return;
        }
    }

    cmdVel.publish(twist);
}, 100);

// Publishing a Topic
// ------------------

var cmdVel = new ROSLIB.Topic({ // Create a Topic object to publish messages to the cmd_vel topic.
    ros: ros,
    name: '/turtle1/cmd_vel',
    messageType: 'geometry_msgs/Twist'
});

// Subscribing to a Topic
// ----------------------

var listener = new ROSLIB.Topic({
    ros: ros,
    name: '/listener',
    messageType: 'std_msgs/String'
});

listener.subscribe(function (message) {
    console.log('Received message on ' + listener.name + ': ' + message.data);
    listener.unsubscribe();
});

// Generating Random Science Data
// ------------------------------

var scienceData = new ROSLIB.Topic({
    ros: ros,
    name: '/science_data',
    messageType: 'std_msgs/String'
});

(function loop() {
    let randInt = Math.round(Math.random() * 200) + 150;
    setTimeout(function () {
        data = `${Math.random()}`.slice(2, 14).split('').reduce((a, e, i) => a + e + (i % 2 === 1 ? ' ' : ''), '');
        var data = new ROSLIB.Message({
            data
        });
        scienceData.publish(data);

        loop();
    }, randInt);
}());

// Display Random Science Data
// ---------------------------

scienceData.subscribe(function (message) {
    // console.log('Received message on ' + scienceData.name + ': ' + message.data);
    document.getElementById("scienceData").innerHTML = "Science Data: " + message.data;
});

/* ========================================================================== */
/*                  CODE BELOW IS STORED FOR LATER REFERENCE                  */
/* ========================================================================== */

// // Calling a service
// // -----------------

// var addTwoIntsClient = new ROSLIB.Service({
//     ros: ros,
//     name: '/add_two_ints',
//     serviceType: 'rospy_tutorials/AddTwoInts'
// });

// var request = new ROSLIB.ServiceRequest({
//     a: 1,
//     b: 2
// });

// addTwoIntsClient.callService(request, function (result) {
//     console.log('Result for service call on '
//         + addTwoIntsClient.name
//         + ': '
//         + result.sum);
// });

// // Getting and setting a param value
// // ---------------------------------

// ros.getParams(function (params) {
//     console.log(params);
// });

// var maxVelX = new ROSLIB.Param({
//     ros: ros,
//     name: 'max_vel_y'
// });

// maxVelX.set(0.8);
// maxVelX.get(function (value) {
//     console.log('MAX VAL: ' + value);
// });