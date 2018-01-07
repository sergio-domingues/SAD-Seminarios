var dm = require ('./dm_remote.js');

var HOST = '127.0.0.1';
var PORT = 9000;


dm.Start(HOST, PORT, function () {
    	// Write the command to the server 
   	dm.getSubjectList (function (ml) {
   		console.log ("here it is:")
   		console.log (JSON.stringify(ml));
   	});
});
