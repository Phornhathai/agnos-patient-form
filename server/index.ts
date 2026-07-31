import { createServer } from "http";
import { Server } from "socket.io";

// create http blank server for socket.io
const httpServer = createServer();

// create instance of socket.io and bind to httpserver
const io = new Server(httpServer, {
  cors: {
    origin: "*", // production
    methods: ["GET", "POST"],
  },
});

// keep value of last patient in memory of server
// this var will be gone when server restart - for real-time sync demo

let latestPatient: unknown = null;

// everytime client connect to server it will run code here once
io.on("connection", (socket) => {
  console.log(`[Socket] client connected: ${socket.id}`);

  // when client connect successful, send last information soon
  // in case when staff just open website but patient filled out before
  if (latestPatient) {
    socket.emit("patient:data", latestPatient);
  }

  // listern in case "patient:update" when patient submit
  socket.on("patient:update", (data: unknown) => {
    latestPatient = data; // update latest information at server
    // broadcast to every client that connected
    socket.broadcast.emit("patient:update", data);
  });

  // in case client disconnected (closed tab / lost signal)
  socket.on("disconnect", () => {
    console.log(`[Socket] client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT ?? 4000;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
