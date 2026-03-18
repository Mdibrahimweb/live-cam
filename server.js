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
    maxHttpBufferSize: 2e7 // HD ফ্রেমের জন্য ২০ মেগাবাইট লিমিট
});

io.on('connection', (socket) => {
    socket.on('store-frame', (frame) => {
        // volatile ব্যবহার করা হয়েছে যাতে স্লো নেটেও লেটেস্ট ফ্রেম আগে পৌঁছায়
        socket.broadcast.volatile.emit('view-live', frame);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 HD Server Running: http://localhost:${PORT}`));