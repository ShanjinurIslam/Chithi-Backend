const express = require('express')
const User = require('../model/user');
const multer = require('multer')
const sharp = require('sharp')

const router = express.Router()
const auth = require('../middleware/auth')

const upload = multer({
    //dest:'avatar',
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)){
            return cb(new Error('Please upload an image'))
        }

        cb(undefined,true)
    }
})

// User CRUD

router.post('/user/create', async(req,res)=>{
    console.log(req.body)
    try{
        const user = new User(req.body)
        await user.save()
        return res.status(200).send(user)
    }catch(error){
        console.log(error)
        res.status(500).send({'message':error.message})
    }
});

router.post('/user/upload',auth,upload.single('avatar'),async(req,res)=>{

    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    return res.status(200).send()
},(error,req,res,next)=>{
    res.status(500).send({'message':error.message})
});

router.delete('/user/upload',auth,async(req,res)=>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    }catch(error){
        res.status(500).send({'message':error.message})
    }
})

router.get('/user/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error('User/User avatar not found')
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(error){
        res.status(500).send({'message':error.message})
    }
})

router.get('/user/read/:id', async(req,res)=>{
   
   try{
       const user = await User.findById(req.params.id)
       if(!user){
           throw new Error('user not found')
       }
       else{
           return res.status(200).send(user)
       }
   }catch(error){
        console.log(error)
        res.status(500).send({'message':error.message})
   }

});

router.get('/user/read_all', async(req,res)=>{
    
    try{
        const users = await User.find({})
        if(!users){
            throw new Error('user not found')
        }
        else{
            return res.status(200).send(users)
        }
    }catch(error){
         console.log(error)
         res.status(500).send({'message':error.message})
    }
 
 });

router.patch('/user/update/:id', async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(404).send('Invalid Update Request')
    }

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send({'message':error.message})
    }
});

router.delete('/user/delete/:id',async(req,res)=>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({'message':'User does not exist'})
        }
        return res.status(200).send({'message':'User deleted'})
    }catch(error){
        res.status(500).send({'message':error.message})
    }
})

// User Login
router.post('/login',async(req,res)=>{
    const username = req.body.username ;
    const password = req.body.password ;
    try{
        const user = await User.authenticate(username,password)
        const token = await user.generateAuthToken()
        return res.status(200).send({user,token})
    }catch(error){
        res.status(500).send({'message':error.message})
    }
})

router.post('/logout',auth,async(req,res)=>{
    const user = req.user
    const token = req.token

    await user.removeToken(token)

    return res.status(200).send(user);
})


module.exports = router