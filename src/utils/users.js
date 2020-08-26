const User = require('../model/user')
const users = []

const addUser = async(userId,socketId)=>{

    const existingUser = users.find((user)=>{
        return user._id == userId
    })

    if(existingUser){
        return {
            error:'User already connected'
        }
    }
    
    const user = await User.findById(userId)
    console.log(user)

    if(!user){
        return {
            error:'User not found'
        }
    }
    else{
        var object = user
        delete object.tokens
        delete object.password
        delete object.createdAt
        delete object.updatedAt
        object['socketId'] = socketId
        
        users.add(object)

        return {object}
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