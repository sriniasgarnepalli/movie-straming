const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const rooms = {};

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        hostId: socket.id,
        users: new Set()
      };
    }
    rooms[roomId].users.add(socket.id);

    const isHost = rooms[roomId].hostId === socket.id;
    socket.emit("host-status", isHost);
    console.log(
      `🟢 ${socket.id} (${username}) joined room ${roomId} as ${
        isHost ? "host" : "viewer"
      }`
    );

    socket.to(roomId).emit("request-current-state");
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

  // ✅ Receive state from host and send to new joiner
  socket.on("current-state", ({ roomId, ...data }) => {
    socket.to(roomId).emit("current-state", data);
    console.log(`📦 Sent current video state to room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);

        // If host left, assign new host
        if (room.hostId === socket.id) {
          const remainingUsers = [...room.users];
          if (remainingUsers.length > 0) {
            const newHostId = remainingUsers[0];
            room.hostId = newHostId;
            io.to(newHostId).emit("host-status", true);
            console.log(`👑 Reassigned host of room ${roomId} to ${newHostId}`);
          } else {
            // No users left, delete room
            delete rooms[roomId];
            console.log(`🗑️ Room ${roomId} removed`);
          }
        }

        break;
      }
    }
  });
});

server.listen(4000, () => {
  console.log("🎬 Socket.IO server listening on port 4000");
});
