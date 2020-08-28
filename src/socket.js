const socketio = require('socket.io')
const { addUser,getUsers, removeUser } = require('./utils/users')


function chat_socket(server){
    const io = socketio(server)

    io.on("connection",(userSocket)=>{
        userId = userSocket.handshake.query.id
        
        userSocket.join(userId,async()=>{
            userSocket.emit('active_list',getUsers())
            const {error,user} = await addUser(userId,userSocket.id)
            if(error){
                console.log(error)
            }
            else{
                userSocket.broadcast.emit('new_user',user)
            }
        })

        userSocket.on('send_message',(object)=>{
            const receiverID = object.receiverID ;
            userSocket.to(receiverID).emit('receive_message',object)
        })

        userSocket.on('disconnect',()=>{
            removeUser(userSocket.id)
            console.log('User disconnected')
        })
    })

    
}

module.exports = chat_socket