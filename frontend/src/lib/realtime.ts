import { io, Socket } from 'socket.io-client';
import { API_URL } from './api';

const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');
let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  if (!socket.connected) socket.connect();
  return socket;
}

export function subscribeToResource(resource: string, onChange: (payload: unknown) => void) {
  const currentSocket = getSocket();
  const event = `${resource}:changed`;
  currentSocket.on(event, onChange);
  return () => {
    currentSocket.off(event, onChange);
  };
}
