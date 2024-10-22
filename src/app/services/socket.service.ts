import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4000')
  }

  sendCursorPosition(position: { x: number; y: number }) {
    this.socket.emit('cursorMove', position);
  }

  onCursorUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('cursorUpdate', (data: any) => {
        observer.next(data);
      });
    });
  }

  onInitialCursors(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('initialCursors', (data: any) => {
        observer.next(data);
      });
    });
  }

  onRemoveCursor(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('removeCursor', (userId: any) => {
        observer.next(userId);
      });
    });
  }
}