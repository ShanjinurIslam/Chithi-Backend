const express = require('express')
const User = require('../model/user');
const multer = require('multer')
const sharp = require('sharp')
const request = require('request')

const ChatThread = require('../model/chat_thread');
const Message = require('../model/message');

const router = express.Router()
const auth = require('../middleware/auth')

const upload = multer({
    //dest:'avatar',
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

// User CRUD

router.post('/user/create', async (req, res) => {
    try{
        var existingUser = await User.findOne({username:req.body.username})
        console.log(existingUser)
        if(existingUser){
            throw new Error('User already exists')
        }
    }catch(error){
        return res.status(500).send(error.message)
    }

    try {
        const user = new User(req.body)
        request({
            url: 'https://ui-avatars.com/api/?name=' +
            user.username +
            '&size=512',
            //make the returned body a Buffer
            encoding: null
        }, async function (error, response, body) {

            //will be true, body is Buffer( http://nodejs.org/api/buffer.html )
            console.log(body instanceof Buffer);
            user.avatar = body
            await user.save()
            const token = await user.generateAuthToken()
            var object = new Object();
            object['_id'] = user._id
            object['username'] = user.username
            object['token'] = token

            return res.status(200).send(object)
        });
    } catch (error) {
        //console.log(error)
        res.status(500).send(error.message)
    }
});
router.post('/user/upload', [auth, upload.single('avatar')], async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    return res.status(200).send()
}, (error, req, res, next) => {
    res.status(500).send(error.message)
});

router.delete('/user/upload', auth, async (req, res) => {
    
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/user/avatar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('User/User avatar not found')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/user/read', auth, async (req, res) => {

    try {
        const user = req.user
        return res.status(200).send(user)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }

});

router.patch('/user/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(404).send('Invalid Update Request')
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.delete('/user/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send({ 'message': 'User does not exist' })
        }
        return res.status(200).send({ 'message': 'User deleted' })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// User Login
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await User.authenticate(username, password)
        const token = await user.generateAuthToken()

        var object = new Object()
        object['_id'] = user._id
        object['username'] = user.username
        object['token'] = token

        return res.status(200).send(object)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/logout', auth, async (req, res) => {
    const user = req.user
    const token = req.token

    await user.removeToken(token)

    return res.status(200).send(user);
})




router.get('/threads',auth,async(req,res)=>{
    const threads = req.user.threads
    const chat_threads = []

    for(var i=0;i<threads.length;i++){
        const thread = await ChatThread.findOne({threadID:threads[i]})
        var object = new Object();
        object['threadID'] = thread.threadID ;
        const total = thread.messages.length;
        const lastMessage = await Message.findById(thread.messages[total-1]);
        object['lastMessage'] = lastMessage
        chat_threads.push(object)
    }

    res.status(200).send(chat_threads);
})

router.get('/threads/:threadID',auth,async(req,res)=>{
    const threadID = req.params.threadID
    
    try{
        var object = new Object()
        const thread = await ChatThread.findOne({threadID:threadID})
        object['threadID'] = threadID
        const messages = []
        for(var i=0;i<thread.messages.length;i++){
            const message = await Message.findById(thread.messages[i])
            messages.push(message)
        }
        object['messages'] = messages
        res.status(200).send(object);
    }catch(error){
        return res.status(500).send(error)
    }
})

router.post('/store_message',auth,async (req,res)=>{
    const rec_user = await User.findById(req.body.receiver)

    var sender = new Object()
    sender['_id'] = req.user._id
    sender['username'] = req.user.username

    var receiver = new Object()
    receiver['_id'] = rec_user._id
    receiver['username'] = rec_user.username

    console.log({sender:sender,receiver:receiver,content:req.body.content})

    const index = req.user.checkThreadExists(req.body.threadID)

    var thread = null
    if(index==-1){
        thread = new ChatThread({threadID:req.body.threadID})
        await thread.save()

        req.user.threads = req.user.threads.concat(req.body.threadID)
        rec_user.threads = rec_user.threads.concat(req.body.threadID)

        await req.user.save()
        await rec_user.save()
    }
    else{
        thread = await ChatThread.findOne({threadID:req.body.threadID})
    }

    const message = new Message({sender:sender,receiver:receiver,content:req.body.content})
    await message.save()

    thread.messages = thread.messages.concat(message)
    await thread.save()
    
    return res.status(200).send()
})




module.exports = router