module.exports = function(io) {
    io.on('connection', (socket) =>{
        socket.on('chat-msg', (msg) =>{
            io.emit('message', msg)
        })
    })
}