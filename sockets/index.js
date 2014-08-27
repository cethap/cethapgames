/**
 * Module Routes.
 */

exports.init = function(io){
	io.sockets.on('connection', function (socket) {
		//Ejemplo para devolver evento a usuario que crea socket, si espera este evento
		//socket.emit('news', { hello: 'world' });
		//Ejemplo para devolver evento todos los usuarios conectados que han creado un socket
		//y que esperen eset evento
		socket.on('sendOrentation', function (data) {
			io.sockets.emit('Orientation', data);
		});

		socket.on('sendGravity', function (data) {
			io.sockets.emit('Gravity', data);
		});

		socket.on('sendReturn', function (data) {
			io.sockets.emit('Return', data);
		});

		socket.on('SendArriba', function (data) {
			io.sockets.emit('Arriba', data);
		});

		socket.on('SendAbajo', function (data) {
			io.sockets.emit('Abajo', data);
		});

		socket.on('sendMove', function (data) {
			io.sockets.emit('Mueve', data);
		});

		socket.on('sendCierra', function (data) {
			io.sockets.emit('Cierre', data);
		});

	});
};