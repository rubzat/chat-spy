const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'https://chat-spy.vercel.app', 'https://chat-spy-xmh4.vercel.app'];

app.use(cors({ origin: allowedOrigins }));

const io = socketIo(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 3001;

// --- Data Structures ---
const socketToPin = {}; // { socketId: pin }
const pinToSocket = {}; // { pin: socketId }
const rooms = {}; // { roomId: { participants: [pin1, pin2], messages: [] } }
const userRooms = {}; // { socketId: [roomId1, roomId2, ...] }

// --- Helper Functions ---

function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createRoom(pin1, pin2) {
  const roomId = uuidv4();
  rooms[roomId] = {
    participants: [pin1, pin2],
    messages: [],
    createdAt: Date.now()
  };

  // Add room to both users
  const socket1 = pinToSocket[pin1];
  const socket2 = pinToSocket[pin2];

  if (!userRooms[socket1]) userRooms[socket1] = [];
  if (!userRooms[socket2]) userRooms[socket2] = [];

  userRooms[socket1].push(roomId);
  userRooms[socket2].push(roomId);

  console.log(`Created room ${roomId} for ${pin1} and ${pin2}`);
  return roomId;
}

function getRoomsBySocket(socketId) {
  return userRooms[socketId] || [];
}

function getOtherParticipant(roomId, myPin) {
  const room = rooms[roomId];
  if (!room) return null;
  return room.participants.find(pin => pin !== myPin);
}

function cleanupRoom(roomId) {
  const room = rooms[roomId];
  if (!room) return;

  // Remove room from participants
  room.participants.forEach(pin => {
    const socketId = pinToSocket[pin];
    if (socketId && userRooms[socketId]) {
      userRooms[socketId] = userRooms[socketId].filter(id => id !== roomId);
    }
  });

  // Delete room
  delete rooms[roomId];
  console.log(`Cleaned up room ${roomId}`);
}

// --- Socket.IO Events ---

io.on('connection', (socket) => {
  // Assign unique PIN automatically
  let pin;
  do {
    pin = generatePin();
  } while (pinToSocket[pin]);

  socketToPin[socket.id] = pin;
  pinToSocket[pin] = socket.id;
  userRooms[socket.id] = [];

  socket.emit('pin_assigned', pin);
  console.log(`Assigned PIN ${pin} to ${socket.id}`);

  // --- Request Chat ---
  socket.on('request_chat', (targetPin) => {
    const senderPin = socketToPin[socket.id];
    const targetSocketId = pinToSocket[targetPin];

    if (!targetSocketId) {
      socket.emit('error', 'PIN no encontrado o desconectado.');
      return;
    }
    if (targetSocketId === socket.id) {
      socket.emit('error', 'No puedes chatear contigo mismo.');
      return;
    }

    // Check if room already exists between these two users
    const existingRoom = getRoomsBySocket(socket.id).find(roomId => {
      const room = rooms[roomId];
      return room && room.participants.includes(targetPin);
    });

    if (existingRoom) {
      socket.emit('error', 'Ya tienes un chat activo con este usuario.');
      return;
    }

    // Notify target
    io.to(targetSocketId).emit('incoming_request', { fromPin: senderPin });
  });

  // --- Accept Chat ---
  socket.on('accept_chat', (targetPin) => {
    const myPin = socketToPin[socket.id];
    const targetSocketId = pinToSocket[targetPin];

    if (!targetSocketId) {
      socket.emit('error', 'Usuario desconectado.');
      return;
    }

    // Create room
    const roomId = createRoom(myPin, targetPin);

    // Notify both participants
    socket.emit('chat_created', { roomId, withPin: targetPin });
    io.to(targetSocketId).emit('chat_created', { roomId, withPin: myPin });

    console.log(`Chat created: ${myPin} <-> ${targetPin} in room ${roomId}`);
  });

  // --- Reject Chat ---
  socket.on('reject_chat', (targetPin) => {
    const targetSocketId = pinToSocket[targetPin];
    if (targetSocketId) {
      io.to(targetSocketId).emit('chat_rejected');
    }
  });

  // --- Send Message ---
  socket.on('send_message', ({ roomId, text }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit('error', 'Chat no encontrado.');
      return;
    }

    const senderPin = socketToPin[socket.id];
    if (!room.participants.includes(senderPin)) {
      socket.emit('error', 'No eres parte de este chat.');
      return;
    }

    const messageId = uuidv4();
    const message = {
      id: messageId,
      text,
      sender: senderPin,
      timestamp: Date.now()
    };

    room.messages.push(message);

    // Send to both participants
    room.participants.forEach(pin => {
      const socketId = pinToSocket[pin];
      if (socketId) {
        if (socketId === socket.id) {
          io.to(socketId).emit('message_sent', { roomId, message });
        } else {
          io.to(socketId).emit('receive_message', { roomId, message });
        }
      }
    });

    // Auto-delete after 60 seconds
    setTimeout(() => {
      if (rooms[roomId]) {
        rooms[roomId].messages = rooms[roomId].messages.filter(m => m.id !== messageId);

        // Notify both participants
        room.participants.forEach(pin => {
          const socketId = pinToSocket[pin];
          if (socketId) {
            io.to(socketId).emit('message_expired', { roomId, messageId });
          }
        });
      }
    }, 60000);
  });

  // --- Close Chat ---
  socket.on('close_chat', (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    const myPin = socketToPin[socket.id];
    if (!room.participants.includes(myPin)) return;

    // Notify other participant
    const otherPin = getOtherParticipant(roomId, myPin);
    if (otherPin) {
      const otherSocketId = pinToSocket[otherPin];
      if (otherSocketId) {
        io.to(otherSocketId).emit('chat_closed', { roomId, byPin: myPin });
      }
    }

    // Cleanup room
    cleanupRoom(roomId);
  });

  // --- Disconnect ---
  socket.on('disconnect', () => {
    const pin = socketToPin[socket.id];
    console.log(`User ${pin} (${socket.id}) disconnected`);

    // Close all rooms this user is in
    const userRoomIds = getRoomsBySocket(socket.id);
    userRoomIds.forEach(roomId => {
      const room = rooms[roomId];
      if (room) {
        const otherPin = getOtherParticipant(roomId, pin);
        if (otherPin) {
          const otherSocketId = pinToSocket[otherPin];
          if (otherSocketId) {
            io.to(otherSocketId).emit('chat_closed', { roomId, byPin: pin });
          }
        }
        cleanupRoom(roomId);
      }
    });

    // Cleanup user data
    delete pinToSocket[pin];
    delete socketToPin[socket.id];
    delete userRooms[socket.id];
  });
});

// --- HTTP Routes ---
app.get('/', (req, res) => {
  res.send('Chat Spy Server Running');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
