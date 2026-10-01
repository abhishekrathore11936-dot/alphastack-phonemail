const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory chat store (replace with MongoDB in production)
const userDatabases = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user to their phone room & initialize default chats if empty
  socket.on('register_user', (phoneNumber) => {
    socket.join(phoneNumber);
    console.log(`Device registered to room: ${phoneNumber}`);
    
    if (!userDatabases[phoneNumber] || userDatabases[phoneNumber].length === 0) {
      userDatabases[phoneNumber] = [
        { 
          id: 1, 
          name: 'PM-Kisan', 
          recipient: 'pmkisan@phonemail.com',
          snippet: 'Please check your PM-Kisan beneficiary status and confirm your details.', 
          time: '08:55 AM', 
          unread: 1, 
          tag: 'Favourites',
          favourite: true,
          messages: [
            { id: 101, sender: 'other', text: 'Please check your PM-Kisan beneficiary status and confirm your details.', time: '08:55 AM', starred: false }
          ]
        },
        { 
          id: 2, 
          name: 'High Court Registry', 
          recipient: 'highcourt@phonemail.com',
          snippet: 'Please find the next hearing notice for your case.', 
          time: '09:10 AM', 
          unread: 1, 
          tag: 'Unread',
          messages: [
            { id: 102, sender: 'other', text: 'Please find the next hearing notice for your case.', time: '09:10 AM', starred: false }
          ]
        },
        { 
          id: 3, 
          name: 'Passport Seva', 
          recipient: 'passportseva@phonemail.com',
          snippet: '📎 [passport_update.pdf] Please find attached the latest update on your passport application.', 
          time: '10:00 AM', 
          unread: 1, 
          tag: 'Attachments',
          messages: [
            { id: 103, sender: 'other', text: '📎 [passport_update.pdf] Please find attached the latest update on your passport application.', time: '10:00 AM', starred: false }
          ]
        }
      ];
    }

    socket.emit('load_chats', userDatabases[phoneNumber]);
  });

  // Handle live message sending
  socket.on('send_message', ({ senderPhone, recipientIdentifier, messageObj, subject }) => {
    console.log(`Message from ${senderPhone} to ${recipientIdentifier}: ${messageObj.text}`);

    // Update sender database
    if (!userDatabases[senderPhone]) userDatabases[senderPhone] = [];
    let senderChats = userDatabases[senderPhone];
    
    let recipientKey = recipientIdentifier.trim();
    let senderChatIndex = senderChats.findIndex(c => c.name.toLowerCase() === recipientKey.toLowerCase() || c.recipient?.toLowerCase() === recipientKey.toLowerCase());

    const formattedSnippet = `Subject: ${subject} - ${messageObj.text}`;

    if (senderChatIndex !== -1) {
      senderChats[senderChatIndex].messages.push(messageObj);
      senderChats[senderChatIndex].snippet = formattedSnippet;
      senderChats[senderChatIndex].time = 'Just now';
    } else {
      senderChats.unshift({
        id: Date.now(),
        name: recipientKey,
        recipient: recipientKey.includes('@') ? recipientKey : `${recipientKey}@phonemail.com`,
        subject: subject,
        snippet: formattedSnippet,
        time: 'Just now',
        unread: 0,
        tag: 'Unread',
        messages: [messageObj]
      });
    }

    io.to(senderPhone).emit('load_chats', senderChats);

    // Deliver to recipient room if online
    const targetRoom = Object.keys(userDatabases).find(phone => 
      phone.replace(/[^a-z0-9]/g, '') === recipientKey.replace(/[^a-z0-9]/g, '') ||
      `${phone}@phonemail.com` === recipientKey.toLowerCase()
    );

    if (targetRoom) {
      if (!userDatabases[targetRoom]) userDatabases[targetRoom] = [];
      let recipientChats = userDatabases[targetRoom];
      
      let incomingMsg = { ...messageObj, sender: 'other' };
      let recipientChatIndex = recipientChats.findIndex(c => c.name.toLowerCase() === senderPhone.toLowerCase() || c.recipient?.toLowerCase().includes(senderPhone));

      if (recipientChatIndex !== -1) {
        recipientChats[recipientChatIndex].messages.push(incomingMsg);
        recipientChats[recipientChatIndex].snippet = formattedSnippet;
        recipientChats[recipientChatIndex].unread = (recipientChats[recipientChatIndex].unread || 0) + 1;
        recipientChats[recipientChatIndex].time = 'Just now';
      } else {
        recipientChats.unshift({
          id: Date.now(),
          name: senderPhone,
          recipient: `${senderPhone}@phonemail.com`,
          subject: subject,
          snippet: formattedSnippet,
          time: 'Just now',
          unread: 1,
          tag: 'Unread',
          messages: [incomingMsg]
        });
      }

      io.to(targetRoom).emit('load_chats', recipientChats);
      io.to(targetRoom).emit('play_notification_sound');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5001, () => {
  console.log('PhoneMail WebSocket Server running on port 5001');
});