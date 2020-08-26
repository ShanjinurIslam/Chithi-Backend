const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async(req,res,next)=>{
    

    if(req.headers['authorization'] == undefined){
        return res.status(500).send({message:'No token found'})
    }

    const token = req.headers['authorization'].replace('Bearer ','')
    const decoded = jwt.decode(token)

    try{
        const user = await User.findById(decoded._id)
        if(!user){
            return res.status(400).send({'message':'User not found'})
        }
        const isAuth = user.checkAuth(token)

        if (isAuth) {
            req.user = user
            req.token = token
            next()
        } else {
            return res.status(401).send({'message':'Unauthorized'})
        }
    }catch(e){
        return res.status(500).send({message:e.message})
    }
}

module.exports = auth