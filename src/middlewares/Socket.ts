/**
 * Implement socket server
 *
 * @author Léo DELPON <leo.delpon@viacesi.fr>
 */

import { Application } from 'express';
import Log from './Log';
import Local from '../providers/Local';

class Socket {
    public socketio = require('socket.io');
    constructor() {}

    public mountSocketServer(_express: Application) {
        Log.info('Socket :: Mounting Socket server in API');

        const io = this.socketio(_express);
        let interval;

        io.on('connection', (socket) => {
            console.log('New client connected');
            if (interval) {
                clearInterval(interval);
            }
            interval = setInterval(() => getApiAndEmit(socket), 1000);
            socket.on('disconnect', () => {
                console.log('Client disconnected');
                clearInterval(interval);
            });
        });

        const getApiAndEmit = (socket) => {
            const response = new Date();
            // Emitting a new message. Will be consumed by the client
            socket.emit('FromAPI', response);
        };
    }
}

export default new Socket();
