const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);

// CORS configuration for production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["*"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Store: PIN -> socketId
const pinToSocket = {};
// Store: socketId -> PIN
const socketToPin = {};
// Store: socketId -> connectedSocketId (active chat session)
const activeChats = {};

const MESSAGE_LIFETIME_MS = 60000; // 1 minute

// Helper to generate unique 6-digit PIN
const generatePin = () => {
  let pin;
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (pinToSocket[pin]);
  return pin;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Assign PIN on connection
  const pin = generatePin();
  pinToSocket[pin] = socket.id;
  socketToPin[socket.id] = pin;

  socket.emit('pin_assigned', pin);
  console.log(`Assigned PIN ${pin} to ${socket.id}`);

  // --- Chat Request Flow ---

  // 1. Request Chat
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
    if (activeChats[targetSocketId]) {
      socket.emit('error', 'El usuario ya está en otra conversación.');
      return;
    }

    // Notify target
    io.to(targetSocketId).emit('incoming_request', { fromPin: senderPin });
  });

  // 2. Accept Chat
  socket.on('accept_chat', (targetPin) => {
    const targetSocketId = pinToSocket[targetPin];
    if (!targetSocketId) return; // User might have disconnected

    // Establish session
    activeChats[socket.id] = targetSocketId;
    activeChats[targetSocketId] = socket.id;

    // Notify both to start chat
    const roomId = uuidv4(); // Unique ID for this session (optional, but good for logs)
    socket.join(roomId);
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (targetSocket) targetSocket.join(roomId);

    io.to(socket.id).emit('chat_started', { withPin: targetPin });
    io.to(targetSocketId).emit('chat_started', { withPin: socketToPin[socket.id] });
  });

  // 3. Reject Chat
  socket.on('reject_chat', (targetPin) => {
    const targetSocketId = pinToSocket[targetPin];
    if (targetSocketId) {
      io.to(targetSocketId).emit('chat_rejected');
    }
  });

  // --- Messaging in Session ---

  socket.on('send_message', (content) => {
    const recipientSocketId = activeChats[socket.id];

    if (!recipientSocketId) {
      socket.emit('error', 'No estás en una conversación activa.');
      return;
    }

    const senderPin = socketToPin[socket.id];
    const messageId = uuidv4();
    const timestamp = Date.now();

    const messageData = {
      id: messageId,
      senderPin,
      content,
      timestamp,
      expiresAt: timestamp + MESSAGE_LIFETIME_MS
    };

    // Send to recipient
    io.to(recipientSocketId).emit('receive_message', messageData);

    // Send confirmation back to sender
    socket.emit('message_sent', messageData);

    // Schedule expiration
    setTimeout(() => {
      io.to(recipientSocketId).emit('message_expired', messageId);
      io.to(socket.id).emit('message_expired', messageId);
    }, MESSAGE_LIFETIME_MS);
  });

  // --- Disconnect / End Chat ---

  const handleDisconnectOrEnd = () => {
    const partnerSocketId = activeChats[socket.id];
    if (partnerSocketId) {
      // Notify partner
      io.to(partnerSocketId).emit('chat_ended');
      delete activeChats[partnerSocketId];
      delete activeChats[socket.id];
    }

    const pin = socketToPin[socket.id];
    if (pin) {
      delete pinToSocket[pin];
      delete socketToPin[socket.id];
    }
  };

  socket.on('end_chat', () => {
    const partnerSocketId = activeChats[socket.id];
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('chat_ended');
      delete activeChats[partnerSocketId];
      delete activeChats[socket.id];
      socket.emit('chat_ended'); // Also reset sender
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    handleDisconnectOrEnd();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
