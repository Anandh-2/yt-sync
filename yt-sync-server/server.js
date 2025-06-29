import express from "express";
import http from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const rs = rooms.map((r) => ({
    ...r,
    timeoutId: r.timeoutId ? "id" : "null",
  }));
  res.send(rs);
});

const rooms = [];

app.post("/create-room", (req, res) => {
  try {
    const roomId = nanoid(10);
    const timeoutId = setTimeout(() => {
      const room = rooms.find((r) => r.id === roomId);
      if (room) {
        rooms.splice(rooms.indexOf(room), 1);
      }
    }, 5 * 60 * 1000);
    const newRoom = {
      id: roomId,
      members: [],
      master: null,
      timeoutId,
    };
    rooms.push(newRoom);
    console.log(newRoom);
    return res.status(200).json({ roomId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          key: process.env.YT_API_KEY,
          q: req.query.q,
          pageToken: req.query.pageToken
        },
      }
    );
    return res.status(200).json({videos: response.data});
  } catch (err) {
    return res.status(500).json({message:'Server error'});
  }
});

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId;
  const username = socket.handshake.query.username;
  socket.username = username || getRandomName();
  socket.roomId = roomId;
  const room = rooms.find((room) => room.id === roomId);
  if (room) {
    if (!room.members.includes(socket.id)) room.members.push(socket.id);

    if (!room.master) {
      room.master = socket.id;
    }

    if (room.timeoutId) {
      clearTimeout(room.timeoutId);
      room.timeoutId = null;
    }
  } else {
    socket.emit("no room");
  }

  socket.join(roomId);
  console.log(rooms);

  socket.on("new message", (msg) => {
    console.log(msg);
    io.to(socket.roomId).emit("new message", {
      username: socket.username,
      id: socket.id,
      msg,
    });
  });

  socket.on("disconnect", () => {
    console.log(rooms);
    console.log("roomId", socket.roomId);
    const room = rooms.find((r) => r.id === socket.roomId);
    if (room) {
      room.members = room.members.filter((id) => id !== socket.id);
      if (room.members.length === 0) {
        const timeoutId = setTimeout(() => {
          rooms.splice(rooms.indexOf(room), 1);
        }, 1 * 60 * 1000);
        room.master = null;
        room.timeoutId = timeoutId;
      } else {
        if (room.master === socket.id) {
          room.master = room.members[0];
        }

        io.to(socket.roomId).emit("room update", {
          members: room.members,
        });
      }
    }
    io.to(socket.roomId).emit("leave", {
      alert: `${socket.username} left`,
    });
  });
});

const PORT = process.env.PORT;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const getRandomName = () => {
  const randomNames = [
    "StreamSlinger",
    "CineBuff",
    "ShowSnacker",
    "BingeRider",
    "DramaDive",
    "FlickFreak",
    "WatchWanderer",
    "MovieMuncher",
    "SitcomJunkie",
    "ClipCatcher",
  ];
  return randomNames[Math.floor(Math.random() * randomNames.length)];
};
