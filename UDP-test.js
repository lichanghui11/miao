var dgram = require('dgram');
var soket = dgram.createSocked('udp4');
soket.bind(12345)