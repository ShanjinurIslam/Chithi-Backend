const socketio = require('socket.io')
const { addUser,removeUser } = require('./utils/users')


function chat_socket(server){
    const io = socketio(server)

    io.on("connection",(userSocket)=>{
        console.log('New user joined')
        userSocket.on('join',(id)=>{
            const {error,user} = addUser(id,userSocket.id)
            
            if(error){
                console.log(error)
            }
            else{
                console.log(user)
                userSocket.emit('newUser',user)
            }
        })
        
        userSocket.on("send_message", (data) => {
            console.log(data)
            userSocket.broadcast.emit("receive_message", data)
        })

        userSocket.on('disconnect',()=>{
            const user = removeUser(userSocket.id)
            console.log(user)
            console.log('User disconnected')
        })
    })

    
}

module.exports = chat_socket