const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type:'string', unique:true},
    email: 'string',
    password: 'string',
    favs: 'array',
});

const User = mongoose.model('User', userSchema);

module.exports = User;