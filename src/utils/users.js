const User = require('../model/user')
const users = []

const addUser = async(userId)=>{

    const existingUser = users.find((user)=>{
        return user._id == userId
    })

    if(existingUser){
        return {
            error:'User already connected'
        }
    }
    
    const user = await User.findById(userId)

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
        
        users.add(object)

        console.log(object)

        return {object}
    }
}

module.exports = {addUser}