const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors()); // CORS সাপোর্ট যোগ করা হয়েছে

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e7 
});

// স্ট্যাটিক ফাইল সার্ভ করা (নিশ্চিত করুন আপনার HTML ফাইলগুলো public ফোল্ডারে আছে)
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Connected Device:', socket.id);

    socket.on('store-frame', (frame) => {
        socket.broadcast.volatile.emit('view-live', frame);
    });

    socket.on('disconnect', () => {
        console.log('Device Disconnected');
    });
});

// রেন্ডারের জন্য পোর্ট সেটআপ
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Security Server is running on port ${PORT}`);
});