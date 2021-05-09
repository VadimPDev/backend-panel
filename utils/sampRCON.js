function SAMPApi(ip, port, pwd) {
	if (ip === undefined || port === undefined || pwd === undefined)
		throw new Error('Отсутствуют все необходимые параметры (IP, Port, Password)');

	const dgram = require('dgram');
	const client = dgram.createSocket('udp4');

	const ipArray = ip.split('.');
	for (let i = 0; i < ipArray.length; i++) ipArray[i] = parseInt(ipArray[i]);

	const sendRcon = function(command, callback) {
		let packet = Buffer.concat([
			Buffer.from('SAMP'),

			Buffer.from(ipArray),
			Buffer.from([ port & 0xFF, port >> 8 & 0xFF ]),

			Buffer.from('x'),

			Buffer.from([ pwd.length & 0xFF, pwd.length >> 8 & 0xFF ]),
			Buffer.from(pwd),

			Buffer.from([ command.length & 0xFF, command.length >> 8 & 0xFF ]),
			Buffer.from(command)
		]);

		client.on('message', function(msg, info) {
			console.log(msg, info)
			return (callback !== undefined) ? callback(msg, info) : void 0;
		});
		client.on('error',(e) =>{
			console.log('error')
		})
		client.send(packet, 0, packet.length, port, ip, function(err) { if (err) throw err })
	};

	return {
		call: sendRcon,
		ban: function(id, callback) {
			sendRcon('ban ' + id, callback);
		},
		kick: function(id, callback) {
			sendRcon('kick ' + id, callback);
		},
		close: function() {
			client.close()
		}
	}
}

module.exports = SAMPApi;