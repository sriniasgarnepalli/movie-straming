const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`🟢 ${socket.id} joined room ${roomId}`);
  });

  socket.on("sync-playback", ({ roomId, action, currentTime }) => {
    socket.to(roomId).emit("sync-playback", { action, currentTime });
    console.log(
      `📡 ${socket.id} sent ${action} @ ${currentTime.toFixed(
        2
      )}s to room ${roomId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });

  socket.on("video-selected", ({ roomId, url }) => {
    socket.to(roomId).emit("video-selected", { url });
  });
});

server.listen(4000, () => {
  console.log("🎬 Socket.IO server listening on port 4000");
});
