const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://YOUR_FRONTEND.vercel.app"
    ],
    methods: ["GET", "POST"]
  }
});

/**
 * groups structure:
 * {
 *   groupId: {
 *     leaderId: userId,
 *     users: {
 *       userId: {
 *         userId,
 *         name,
 *         latitude,
 *         longitude
 *       }
 *     }
 *   }
 * }
 */
const groups = {};

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // 📍 Receive / update location
  socket.on("send-location", (data) => {
    const { group, userId, name, latitude, longitude } = data;

    if (!group || !userId || !name) {
      console.warn("⚠️ Invalid send-location payload:", data);
      return;
    }

    // Create group if not exists
    if (!groups[group]) {
      console.log("🆕 Creating group:", group);
      groups[group] = {
        leaderId: userId, // 👑 first user is leader
        users: {},
      };
    }

    // Join socket room
    socket.join(group);

    // Update / upsert user (NO duplicates on refresh)
    groups[group].users[userId] = {
      userId,
      name,
      latitude,
      longitude,
    };

    console.log(
      `📡 Location updated | Group: ${group} | User: ${name}`
    );

    // Broadcast updated group state
    io.to(group).emit("group-update", {
      leaderId: groups[group].leaderId,
      users: groups[group].users,
    });
  });

  // 👑 Change leader (leader only)
  socket.on("change-leader", ({ group, newLeaderId }) => {
    if (!groups[group]) return;

    // Only current leader can change leader
    if (groups[group].leaderId !== newLeaderId) {
      groups[group].leaderId = newLeaderId;

      console.log(
        "👑 Leader changed:",
        newLeaderId,
        "in group",
        group
      );

      io.to(group).emit("group-update", {
        leaderId: groups[group].leaderId,
        users: groups[group].users,
      });
    }
  });

  // 🚪 Leave group (button click)
  socket.on("leave-group", ({ group, userId }) => {
    if (!groups[group] || !groups[group].users[userId]) return;

    console.log(
      "👋 User left via button:",
      groups[group].users[userId].name
    );

    delete groups[group].users[userId];

    // Reassign leader if needed
    if (groups[group].leaderId === userId) {
      const remaining = Object.keys(groups[group].users);
      groups[group].leaderId = remaining[0] || null;
    }

    socket.leave(group);

    // Notify others
    io.to(group).emit("group-update", {
      leaderId: groups[group].leaderId,
      users: groups[group].users,
    });

    // Cleanup empty group
    if (Object.keys(groups[group].users).length === 0) {
      console.log("🧹 Deleting empty group:", group);
      delete groups[group];
    }
  });

  // ❌ Disconnect (DO NOTHING)
  // We do NOT remove user here to avoid duplicates on refresh
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});
