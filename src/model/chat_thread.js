const mongoose = require('mongoose')

const ChatThreadSchema = new mongoose.Schema({
    threadID: {
        type:String,
        required:true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required:true
        }
    ]
})

const ChatThread = mongoose.model('ChatThread',ChatThreadSchema)
module.exports = ChatThread