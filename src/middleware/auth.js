const jwt = require('jwt')
const User = require('../model/user')

const auth = async(req,res,next)=>{
    const token = req.header('Authorization').replace('Bearer','')
    const decoded = jwt.decode(token)

    try{
        const user = await User.findById(decoded._id)
        if(!user){
            return res.status(400).send({'message':'User not found'})
        }
    }catch(e){
        return res.status(500).send({message:e.message})
    }
}