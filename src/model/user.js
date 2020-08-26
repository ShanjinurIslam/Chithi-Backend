const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection);

const UserSchema = new mongoose.Schema({
    _id : {
        type: Number,
        required:true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage:{
        type:Buffer
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    tokens: [{
        token: {
            type:String,
            required:true,
        }
    }]
})

UserSchema.plugin(autoIncrement.plugin,'User')

UserSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id }, 'abc123')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.methods.checkAuth = function(token) {
    const user = this
    const index = user.tokens((e)=>{
        return e == token
    })

    if(index != -1){
        return true
    }
    else{
        return false
    }
}

UserSchema.methods.checkUsername = async function(username) {
    const user = await User.findOne({username:username})
    if(user){
        return true;
    }
    else{
        return false;
    }
}

UserSchema.statics.authenticate = async function(username,password){
    const user = await User.findOne({username:username})

    if(!user){
        throw new Error('Invalid username or password')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Invalid username or password')
    } else {
        return user
    }
}


UserSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User',UserSchema)

module.exports = User