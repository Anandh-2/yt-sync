const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const nanoid = require('nanoid');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// app.get('/',(req, res)=>{
//     res.send('<h1>Hello</h1>');
// });

const rooms = [];

app.post('/create-room', (req, res)=>{
    try{
        const roomId = nanoid(10);
        return res.status(200).json({roomId});
    } catch(err){
        return res.status(500).json({message: 'Server error'});
    }
})

io.on('connection',(socket)=>{
    const roomId = socket.handshake.query.roomId;
    const username = socket.handshake.query.username;
    socket.username = username;
    const room = rooms.find(room => room.id===roomId);
    if(room){
        if(!room.members.includes(socket.id))
        room.members.push(socket.id);
    }else{
        const newRoom = {
            id: roomId,
            members:[socket.id],
            master: socket.id
        }
        rooms.push(newRoom);
    }
    socket.join(roomId);

    socket.on('new message', (msg)=>{
        io.to(roomId).emit('new message', {
            username:socket.username,
            msg
        });
    })

    socket.on('disconnect', ()=>{
        room.members = room.members.filter(id => id !== socket.id);
        if(room.members.length===0){
            rooms = rooms.filter(r=>r.id!==room.id);
        }else{
            if(room.master===socket.id){
                room.master=room.members[0];
            }

            io.to(roomId).emit('room update',{
                members: room.members,
            })
        }
        io.to(roomId).emit('leave', {
            alert: `${socket.username} left`
        })
    })
})

const PORT = process.env.PORT;

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})