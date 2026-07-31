// encapsulate creating connection of socket.io-client to the function
// use 'singleton' pattern to create instance once, store it in a variable outside the function and reuse it repeatedly
import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

// store this instance outside the function for everytime that call getSocket, will get same connection
let socketInstance: Socket | null = null;

// function socket instance - create new one everytime that is called
export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }
  return socketInstance;
}
