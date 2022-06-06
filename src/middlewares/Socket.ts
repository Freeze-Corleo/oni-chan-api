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
  constructor() {
  }


  public mountSocketServer(_express: Application) {
    Log.info(' Socket :: Mounting Socket server in API');

    this.socketio(_express, {
      cors: {
          origin: Local.config().url ?? `https://test-onichan-api.herokuapp.com`,
          methods: ["GET", "POST"],
          path: "/socket.io",
          transport:['websocket'],
          secure: true,
        }
  });
  }

}

export default new Socket;