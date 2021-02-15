// modelo de como guarda la informacion mongodb

const {model, Schema} = require('mongoose')

const userSchema = new Schema ({
    name: String, 
    email: String,
    username: String,
    password: String,
    createdAt: String
})

module.exports = model('User', userSchema)