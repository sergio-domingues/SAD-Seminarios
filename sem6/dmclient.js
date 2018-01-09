var net = require('net');
var HOST = '127.0.0.1';
var PORT = 9000;
var client = new net.Socket();
var Q = require("q");


client.connect(PORT, HOST, function () {
	console.log('CONNECTED TO: ' + HOST + ':' + PORT);
	// Write the command to the server 

	Q(getMessageList(function (ml) {
		console.log("here it is:")
		console.log(JSON.stringify(ml) + '\n')
	})).then(Q(postMessage('message', 'sender', function (ml) {
		console.log("here it is: ")
		console.log(JSON.stringify(ml) + '\n');
	})).then(getMessageList(function (ml) {
		console.log("here it is: ")
		console.log(JSON.stringify(ml) + '\n');
	})));
});

function getMessageList(cb) {
	var cmd = {
		what: 'get message list'
	};
	ml_callback = cb;
	client.write(JSON.stringify(cmd) + '&&&');
}

function postMessage(msg, from, cb) {
	var cmd = {
		what: 'add public message',
		msg: msg,
		from: from
	}
	ml_callback = cb;
	client.write(JSON.stringify(cmd) + '&&&');
};

var ml_callback;

client.on('data', function (data) {

	let replyList = data.toString().split('&&&');

	for (let i = 0; i < replyList.length; i++) {
		if (replyList[i].length == 0)
			break;

		var reply = JSON.parse(replyList[i]);		

		switch (reply.what) {
			case 'get message list':
				console.log('We received the message list');
				ml_callback(reply.obj);
				break;
			case 'add public message':
				console.log('We received the status of adding message');
				ml_callback(reply.obj);
				break;
			default:
				console.log("Panic: we got this: " + reply.what);
		}
	}
});




// Add a 'close' event handler for the client socket
client.on('close', function () {
	console.log('Connection closed');
});