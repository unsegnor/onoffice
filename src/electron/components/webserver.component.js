const express = require('express');
const webApp = express();
const webServer = require('http').Server(webApp);
const io = require('socket.io')(webServer);

webServer.listen(24242);

webApp.use(express.static(__dirname + '/../client'));

let host = null;
let client = null;

function checkHostClient() {
    console.log('Host', !!host);
    console.log('Client', !!client);
    console.log('---');

    if (!host || !client) {
        return;
    }

    host.socket.emit('start');
}

io.on('connect', (socket) => {
    console.log('User connected');

    socket.on('host', (signal) => {
        console.log('Host found!');
        host = {signal, socket};
        checkHostClient();
    });

    socket.on('client', (data) => {
        if (data) {
            host.socket.emit('clientSignal', data);
        } else {
            client = {socket};
            checkHostClient();
        }
    });

    socket.on('cursor-position', (message) => {
        socket.broadcast.emit('cursor-position', message);
    });

    socket.on('message', (message) => {
        socket.broadcast.emit('message', message);
    });
});

console.log('Webserver initialized');