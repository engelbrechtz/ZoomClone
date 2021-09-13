const express = require('express')
// Creates a server based on the express server.
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const { v4: uuidv4 } = require('uuid')
const {runOnChangeOnly} = require("nodemon/lib/config/defaults");

// setting up express server
app.set('view engine', 'ejs')
app.use(express.static('public'))



app.get('/', (req, res) =>{
    res.redirect(`/${uuidv4()}`)
})

app.get('/:room',(req, res) =>{
    res.render('room', {roomId: req.params.roomId})
})

// Emits the connection, event to listen to
io.on('connection', socket => {
    //Listens for user, connecting to room.
    socket.on('join-room', (roomId, userId) =>{
        // console.log(roomId, userId)
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)
        // console.log(socket.to(roomId))

        socket.on('disconnect', () =>{
            socket.to(roomId).broadcast.emit('user-disconnected')
        })
    })
})

// Server runs on port 3000
server.listen(3000)

