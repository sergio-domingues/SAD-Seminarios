var dm = require('./dm_remote.js');

//usage: node dmclient host:port comando

//Asignamos el host y el puerto mediante la funcion auxiliar que implementamos
var HOST = getHostByArg();
var PORT = getPortByArg();

//Funcion auxiliar para procesar los argumentos y conocer el puerto a conectarse
function getPortByArg() {
	//Recojemos los parametros con slice a partir del segundo elemento de la peticion
	var args = process.argv.slice(2);

	//Valor por defecto para el puerto
	var port = 9000;

	//console.log("Port " + port);

	if (args.length > 0) {
		//Procesamos el array de parametros para conocer el par host:puerto
		var aux = args[0]
		var args_split = aux.split(":");

		//Asignamos a port el valor posterior a la aparicion del separador :
		port = args_split[1];

		//console.log("Port " + port);
	}

	return port;
}

//Funcion auxiliar para procesar los argumentos y conocer el host a conectarse
function getHostByArg() {
	//Recojemos los parametros con slice a partir del segundo elemento de la peticion
	var args = process.argv.slice(2);

	//Valor por defecto para el host
	var host = '127.0.0.1';

	//console.log("Host " + host);

	if (args.length > 0) {
		//Procesamos el array de parametros para conocer el par host:puerto
		var aux = args[0]
		var args_split = aux.split(":");

		//Asignamos a host el valor anterior a la aparicion del separador :
		host = args_split[0];

		//console.log("Host " + host);
	}

	return host;
}


dm.Start(HOST, PORT, function () {
	//Recojemos los parametros con slice a partir del tercer elemento de la peticion
	var args = process.argv.slice(3);
	console.log(args);

	if (args.length > 0) {
		//Procesamos el array de parametros para conocer la peticion al servidor
		var aux = args[0];

		switch (aux) {

			case 'add user':
				dm.addUser(args[1], args[2], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'add subject':
				dm.addSubject(args[1], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'get subject list':		
				dm.getSubjectList(function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'get user list':
				dm.getUserList(function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'login':
				dm.login(args[1], args[2], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'add private message':
				dm.addPrivateMessage(args[1], args[2], args[3], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'get private message list':
				dm.getPrivateMessageList(args[1], args[2], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'get subject':
				dm.getSubject(args[1], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'add public message':
				dm.addPublicMessage(args[1], dm.getSubjectId(args[2]), args[3], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			case 'get public message list':
				dm.getPublicMessageList(args[1], function (ml) {
					console.log("here it is:")
					console.log(JSON.stringify(ml));
				});
				break;

			default:
				console.log("Invalid Arguments: " + aux);
		}
	}
});
