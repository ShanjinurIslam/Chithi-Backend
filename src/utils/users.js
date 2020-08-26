const User = require('../model/user')
const users = []

const addUser = async(userId,socketId)=>{

    const index = users.findIndex((user)=>{
        return user._id == userId
    })

    if(index!=-1){
        return {
            error:'User already exists'
        }
    }
    const user = await User.findById(userId)

    if(!user){
        return {
            error:'User not found'
        }
    }
    else{
        var object = new Object()
        object._id = user._id
        object.username = user.username
        object['socketId'] = socketId

        users.push(object)

        return {user:object}
    }
}

const removeUser = function(socketId){
    const index = users.findIndex((user)=>{
        return user.socketId == socketId
    })

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

module.exports = {addUser,removeUser}