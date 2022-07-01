/**
 * Implement socket server
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';
import Log from './Log';

class Socket {
    public socketio = require('socket.io');
    public io;

    public mountSocketServer(_express: Application) {
        let interval;
        Log.info('Socket :: Mounting Socket server in API');
        this.io = this.socketio(_express, {
            cors: {
                origin: 'https://oni-chan-dashbard-818ywef61-freeze-corleo-vercel.vercel.app'
            }
        });
        this.io.on('connection', (socket) => {
            console.log('New client connected');
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(() => getApiAndEmit(socket), 1000);
            socket.on('CommandSocket', (data) => {
                console.log(data);
                socket.broadcast.emit('ClientSocket', data);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
                clearInterval(interval);
            });
        });

        const getApiAndEmit = (socket) => {
            const response = new Date();
            // Emitting a new message. Will be consumed by the client
            socket.broadcast.emit('FromAPI', response);
        };
    }

    public getIoSocket() {
        return this.io;
    }
}

export default new Socket();
