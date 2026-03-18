const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 2e7 // ২০ মেগাবাইট পর্যন্ত ডাটা হ্যান্ডেল করার ক্ষমতা (HD এর জন্য প্রয়োজন)
});

io.on('connection', (socket) => {
    socket.on('store-frame', (frame) => {
        // volatile ব্যবহার করা হয়েছে যাতে ইন্টারনেট স্লো থাকলে পুরনো ফ্রেম বাদ দিয়ে লেটেস্ট ফ্রেম পাঠায়
        socket.broadcast.volatile.emit('view-live', frame);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 HD Security Server Active on Port: ${PORT}`));