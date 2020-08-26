const socketio = require('socket.io')
const { addUser } = require('../../Works/Stack/NodeJS/src/utils/users')


function chat_socket(server){
    const io = socketio(server)

    io.on("connection",(userSocket)=>{
        console.log('New user joined')
        userSocket.on('join',(id)=>{
            const {error,user} = addUser(id)
            if(error){
                // no nothing
            }
            else{
                io.broadcast.emit('newUser',user)
            }
        })
        
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