const socketio = require('socket.io')

function chat_socket(server){
    const io = socketio(server)

    io.on("connection",(userSocket)=>{
        console.log('New user connected')
        
        userSocket.on("send_message", (data) => {
            console.log(data)
            userSocket.broadcast.emit("receive_message", data)
        })

        userSocket.on('disconnect',()=>{
            console.log('User disconnected')
        })
    })

    
}

module.exports = chat_socket