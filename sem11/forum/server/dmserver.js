var dm = require('./dm.js');
var zmq = require('zmq');

var HOST = '127.0.0.1';
var svPort, pubPort;
var dataServerList = [];

//node dmserver <serverport> <publicationPort> <subscriptionList "tcp://address:port,tcp://address:port,...">

function parseArgs() {
    var args = process.argv.slice(2);

    console.log(args.toString());

    if (args.length > 0 && args.length < 3) {
        svPort = args[0];
        pubPort = args[1]

    } else if (args.length > 0 && args.length < 4) {
        svPort = args[0];
        pubPort = args[1]

        dataServerList = args[2].split(",");
        console.log(dataServerList.length, dataServerList.toString());
    } else {
        console.log("dmserver> wrong params!\nusage: node dmserver <svPort> <pubPort>")
    }
}

// ports initialization
parseArgs();


// Create the pub socket for propagation of new messages 
var pubber = zmq.socket('pub');
pubber.bindSync('tcp://' + HOST + ":" + pubPort);
console.log('Publisher bound to port ' + pubPort);

// Create the sub socket for data server (propagation) message reception
var subSocket = zmq.socket('sub');

for (let i = 0; i < dataServerList.length; i++) {
    let ret = subSocket.connect(dataServerList[i]);
}

subSocket.subscribe('checkpoint');

//processing new messages (propagated from other data servers)
subSocket.on('message', function (topic, message) {

    //duplicated code, maybe refactor to a function TODO 
    console.log("Event: topic: " + topic + "\t message: " + message);

    pubber.send(['new messages', message])
})

// Create the server socket, on client connections, bind event handlers
var responder = zmq.socket('rep');
let address = "tcp://" + HOST + ":" + svPort;
console.log("server running on: " + address)


//client binding
responder.bind(address, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on " + address);
    }
});


responder.on('message', function (data) {
    //console.log('request comes in...' + data.toString());

    let reply = processData(data);
    responder.send(JSON.stringify(reply));

    //pubber.send(['checkpoint', reply]);
});

responder.on('close', function (fd, ep) {
    console.log('close, endpoint:', ep);
    responder.close();
});


function processData(msg) {

    var invo = JSON.parse(msg);
    console.log('request is:' + invo.what + ':' + msg);

    var reply = {
        what: invo.what,
        invoId: invo.invoId
    };

    switch (invo.what) {
        case 'add user':
            reply.obj = dm.addUser(invo.u, invo.p)
            break;

        case 'add subject':
            reply.obj = dm.addSubject(invo.sbj);
            break;

        case 'get subject list':
            reply.obj = dm.getSubjectList();
            break;

        case 'get user list':
            reply.obj = dm.getUserList();
            break;

        case 'login':
            reply.obj = dm.login(invo.u, invo.p);
            break;

        case 'add private message':
            reply.obj = dm.addPrivateMessage(invo.msg);
            break;

        case 'get private message list':
            reply.obj = dm.getPrivateMessageList(invo.u1, invo.u2);
            break;

        case 'get subject':
            reply.obj = dm.getSubject(invo.sbj);
            break;

        case 'add public message':
            reply.obj = dm.addPublicMessage(invo.msg);

            if (invo.msg.propagate) {
                pubber.send(['checkpoint', JSON.stringify(invo.msg)]);
                //retardo(3000);
                
                //to avoid duplicate msg on browser forum of client msg sender
                if(invo.svPort != this.svPort)
                    pubber.send(['new messages', JSON.stringify(invo.msg)]);
            }
            break;

        case 'get public message list':
            reply.obj = dm.getPublicMessageList(invo.sbj);
            break;

        default:
            console.log("No action defined for that command!!!");

    }
    return reply;
}

function retardo(n) {
    time = new Date().getTime();
    time2 = time + n;
    while (time < time2) {
        time = new Date().getTime();
    }
}