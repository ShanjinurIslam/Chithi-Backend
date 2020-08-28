const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    sender:{
        _id:{
            type:Number,
            required:true
        },
        username:{
            type:String,
            required:true
        }
    },
    receiver:{
        _id:{
            type:Number,
            required:true
        },
        username:{
            type:String,
            required:true
        }
    },
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Message = mongoose.model('Message',MessageSchema)

module.exports = Message