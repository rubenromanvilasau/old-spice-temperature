const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const serialPort = new SerialPort( { path: 'com3', baudRate: 9600 } );
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))

const app = express();
const server = http.createServer( app );
const io = new Server( server, {
    cors: {
      origin: '*',
    }
} );

// Serve the front
app.use(express.static('public'));

// Initialize socket
io.on('connection', (socket) => {

    console.log('User connected');

  socket.on( 'execute', () => {

    parser.on('data', ( data ) => {
      const temperature = parseFloat( data );
      console.log(`Temperatura recibida: ${temperature}°C`);

      socket.emit('temperature', temperature);

    });

    // setInterval( () => {
    //   const temp = generateRandomTemperature();
    //   socket.emit('temperature', temp);
    // },1000 );

  });
});

/**
 * Generate a random number between 15 and 22
 * @returns a number
 */
const generateRandomTemperature = () => {
  var numero = (Math.random() * (22 - 15) + 15).toFixed(2);
  return parseFloat(numero);
}

// Run server
server.listen( 3000, () => {
    console.log('Server listening on port 3000');
});