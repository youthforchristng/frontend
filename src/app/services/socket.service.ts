import { Injectable } from '@angular/core';
// import { Socket } from 'socket.io-client';

import { Manager, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {

    const ioManager = new Manager('http://your-server-url'); // Replace 'http://your-server-url' with your actual server URL
    const namespace = '/your-namespace'; // Replace '/your-namespace' with the desired namespace, or use an empty string for the default namespace
    const options = { /* Your additional options here */ };

    this.socket = new Socket(ioManager, namespace, options);

    // this.socket = new Socket({ url: 'http://your-server-url' });
    // You can add more Socket.io operations or event listeners here
    this.socket.on('some-event', (data: any) => {
      // Do something with the received data from the server
    });
  }

  // Method to disconnect the Socket.io connection
  disconnectSocket(): void {
    this.socket.disconnect();
  }
}
