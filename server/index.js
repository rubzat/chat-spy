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
  socket.on('send_message', ({ roomId, text, messageType = 'text' }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit('error', 'Sala no encontrada.');
      return;
    }

    const myPin = socketToPin[socket.id];
    if (!room.participants.includes(myPin)) {
      socket.emit('error', 'No perteneces a esta sala.');
      return;
    }

    const message = {
      id: uuidv4(),
      sender: myPin,
      text,
      messageType,
      timestamp: Date.now()
    };

    room.messages.push(message);
    socket.emit('message_sent', { roomId, message });

    // Send to other participant
    const otherPin = getOtherParticipant(roomId, myPin);
    if (otherPin) {
      const otherSocketId = pinToSocket[otherPin];
      if (otherSocketId) {
        io.to(otherSocketId).emit('receive_message', { roomId, message });
      }
    }

    // Auto-delete after 60 seconds
    setTimeout(() => {
      const idx = room.messages.findIndex(m => m.id === message.id);
      if (idx !== -1) {
        room.messages.splice(idx, 1);
        room.participants.forEach(pin => {
          const socketId = pinToSocket[pin];
          if (socketId) {
            io.to(socketId).emit('message_expired', { roomId, messageId: message.id });
          }
        });
      }
    }, 60000);
  });

  // --- Clear Messages ---
  socket.on('clear_messages', (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    const myPin = socketToPin[socket.id];
    if (!room.participants.includes(myPin)) return;

    // Clear messages in room
    room.messages = [];

    // Notify both participants
    room.participants.forEach(pin => {
      const socketId = pinToSocket[pin];
      if (socketId) {
        io.to(socketId).emit('messages_cleared', { roomId });
      }
    });

    console.log(`Messages cleared in room ${roomId}`);
  });

  // --- Check PIN Status ---
  socket.on('check_pin_status', (targetPin) => {
    const isOnline = !!pinToSocket[targetPin];
    socket.emit('pin_status', { pin: targetPin, online: isOnline });
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
