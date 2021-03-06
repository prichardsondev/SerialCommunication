var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var SerialPort = require("serialport")
var xbee_api = require('xbee-api');

var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});


io.on('connection', (socket) => {
    //send (just to new client)
    //socket.emit('updateClient', pinState)
    //receive
    socket.on('write', pin => {
        togglePin(pin);
        //console.log(pin);
    });
});

function togglePin(pin){
    pin = parseInt(pin);
    let data;
    console.log("pin...", pin===7);
    switch(pin) {
        case 6: //CW
            data = [0x7E, 0x00, 0x0F, 0x10, 0x01, 0x00, 0x13, 0xA2, 0x00, 0x40, 0x8B, 0x2E, 0x6E, 0xFF, 0xFE, 0x00, 0x00, 0x36, 0x9f];
            break;
        case 7: //CW
            data = [0x7E, 0x00, 0x0F, 0x10, 0x01, 0x00, 0x13, 0xA2, 0x00, 0x40, 0x8B, 0x2E, 0x6E, 0xFF, 0xFE, 0x00, 0x00, 0x37, 0x9E];
            break;
        case 8: //CCW
            data = [0x7E ,0x00 ,0x0F ,0x10 ,0x01 ,0x00 ,0x13 ,0xA2 ,0x00 ,0x40 ,0x8B ,0x2E ,0x6E ,0xFF ,0xFE ,0x00 ,0x00 ,0x38 ,0x9D];
            break;
        case 9: //CCW
            data = [0x7E ,0x00 ,0x0F ,0x10 ,0x01 ,0x00 ,0x13 ,0xA2 ,0x00 ,0x40 ,0x8B ,0x2E ,0x6E ,0xFF ,0xFE ,0x00 ,0x00 ,0x39 ,0x9C];
            break;
    }
    if(pin === 6 || pin === 7 || pin === 8 || pin === 9)
      xbeeSerial.write(new Buffer.from(data));
}

http.listen(4000, () => {
  console.log('listening on *:3000');
});

//ls /dev/tty*
var xbeeSerial = new SerialPort("/dev/ttyUSB0", {
    baudRate: 9600
});

var xbeeAPI = new xbee_api.XBeeAPI({ api_mode: 1 });
xbeeSerial.pipe(xbeeAPI.parser);

xbeeSerial.on('open', () => console.log("Xbee Port Open"));

let pinState = {
    office:{}
}

// xbeeAPI.parser.on("data", function (frame) {
//     if (typeof frame != 'undefined'){
//         console.log("frame: ", frame);
//         //146 - IO Sample - radio sent
//         //144 - Zigbee packet - we sent
//         if (frame.type == 146){
//             console.log("frame: ", frame);
//             if (frame.remote64 == '0013a20040f743dd') {
//                 if (frame.digitalSamples != pinState.office) {
//                     pinState.office = frame.digitalSamples;
//                     console.log(pinState.office);
//                     //send update to all clients
//                     io.sockets.emit('updateClient', pinState);
//                   }
//             }
//         }
//     }
// });


// ,0x7E ,0x00 ,0x0F ,0x10 ,0x01 ,0x00 ,0x13 ,0xA2 ,0x00 ,0x40 ,0x8B ,0x2E ,0x6E ,0xFF ,0xFE ,0x00 ,0x00 ,0x38 ,0x9D




// var express = require('express');
// var app = express();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
// const SerialPort = require('serialport');
// const parsers = SerialPort.parsers

// var path = require('path');
// const { CLIENT_RENEG_LIMIT } = require('tls');

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/js', express.static(path.join(__dirname, '/node_modules/socket.io/client-dist')));

// app.get('/', (req, res) => {
//   res.sendFile('index.html');
// });

// io.on('connection', (socket) => {
//     //send (just to new client)
//     //socket.emit('updateClient', pinState)
//     //receive
//     socket.on('write', data => {
//         //console.log( `write event ${data}`);
//         write2Port(data);
//     });
// });

// /*
//     #forward
//     :reverse
//     !stop

//     #0 - forward on stepper 0
//     |0 - reverse on stepper 0
//     !0 - stop stepper 0
// */

// function write2Port(data){
//     //console.log(`about to write ${data}`);
//     port.write(data);
// }

// // Use a `\r\n` as a line terminator
// const parser = new parsers.Readline({
//   delimiter: '\r\n',
// })

// const port = new SerialPort('/dev/serial0', {
//   baudRate: 9600,
// })

// port.pipe(parser)

// port.on('open', () => console.log('Port open'))

// parser.on('data', data => console.log(`Got data at server: ${data}`));

// http.listen(3000, () => {
//     console.log('listening on *:3000');
// });
