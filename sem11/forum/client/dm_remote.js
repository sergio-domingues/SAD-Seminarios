var net = require('net');
var zmq = require('zmq');

//var client = new net.Socket(); 

var requester = zmq.socket('req');

var callbacks = {} // hash of callbacks. Key is invoId
var invoCounter = 0; // current invocation number is key to access "callbacks".

var svPort = null;

exports.Start = function (host, port, cb) {
	this.svPort = port;
	//Connect to zmq server
	requester.connect("tcp://" + host + ":" + port);
	console.log("Client connected");
	if (cb != null) cb();
}
//
// When data comes from server. It is a reply from our previous request
// extract the reply, find the callback, and call it.
// Its useful to study "exports" functions before studying this one.
//
requester.on('message', function (data) {
	console.log('data comes in: ' + data);

	let reply = JSON.parse(data);

	switch (reply.what) {

		case 'add user':
			console.log('We received a reply for add command');
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'add subject':
			console.log('We received a reply for add command');
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'get subject list':
			console.log('We received a reply for: ' + reply.what + ':' + reply.invoId);
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'get user list':
			console.log('We received a reply for: ' + reply.what + ':' + reply.invoId);
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'login':
			console.log('We received a reply for: ' + reply.what + ':' + reply.invoId);
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'add private message':
			console.log('We received a reply for add command');
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'get private message list':
			console.log('We received a reply for: ' + reply.what + ':' + reply.invoId);
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'get subject':
			console.log('We received a reply for: ' + reply.what + ':' + reply.invoId);
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'add public message':
			console.log('We received a reply for add command');
			execCallBack(reply.invoId, reply.obj)
			break;

		case 'get public message list':
			console.log('We received a reply for: ' + reply.what + ':' + reply.invoId);
			console.log(reply.obj)
			execCallBack(reply.invoId, reply.obj)
			break;

		default:
			console.log("Panic: we got this: " + reply.what);
	}
});

function execCallBack(id, obj) {

	if (obj === null)
		callbacks[id](); // call the stored callback, no arguments
	else
		callbacks[id](obj);

	delete callbacks[id]; // remove from hash
}

// Add a 'close' event handler for the client socket
requester.on('close', function () {
	console.log('Connection closed');
	requester.close();
});


//
// on each invocation we store the command to execute (what) and the invocation Id (invoId)
// InvoId is used to execute the proper callback when reply comes back.
//
function Invo(str, cb) {
	this.what = str;
	this.invoId = ++invoCounter;
	callbacks[invoCounter] = cb;
}

//
//
// Exported functions as 'dm'
//
//

function writeAux(invo) {
	requester.send(JSON.stringify(invo));
}

exports.addUser = function (u, p, cb) {
	invo = new Invo('add user', cb);
	invo.u = u;
	invo.p = p;
	writeAux(invo);
}

exports.addSubject = function (s, cb) {
	invo = new Invo('add subject', cb);
	invo.sbj = s;
	writeAux(invo);
}

exports.getSubjectList = function (cb) {
	requester.send(JSON.stringify(new Invo('get subject list', cb)));
}

exports.getUserList = function (cb) {
	requester.send(JSON.stringify(new Invo('get user list', cb)));
}

exports.login = function (u, p, cb) {
	invo = new Invo('login', cb);
	invo.u = u;
	invo.p = p;
	writeAux(invo);
}

exports.addPrivateMessage = function (msg, u1, u2, propagate, cb) {
	invo = new Invo('add private message', cb);
	invo.port = svPort;
	invo.msg = {
		isPrivate: true,
		msg: msg,
		from: u1,
		to: u2,
		ts: null,
		propagate: propagate
	};
	writeAux(invo);
}

exports.getPrivateMessageList = function (u1, u2, cb) {
	invo = new Invo('get private message list', cb);
	invo.u1 = u1;
	invo.u2 = u2;
	writeAux(invo);
}

exports.getSubject = function (sbj, cb) {
	invo = new Invo('get subject', cb);
	invo.sbj = sbj;
	writeAux(invo);
}

exports.addPublicMessage = function (msg, sbj, from, propagate, cb) {
	var invo = new Invo('add public message', cb);
	invo.port = svPort;
	invo.msg = {
		msg: msg,
		from: from,
		isPrivate: false,
		to: sbj,
		ts: null,
		propagate: propagate
	};
	writeAux(invo);
}

exports.getPublicMessageList = function (sbj, cb) {
	var invo = new Invo('get public message list', cb);
	invo.sbj = sbj;
	writeAux(invo);
}