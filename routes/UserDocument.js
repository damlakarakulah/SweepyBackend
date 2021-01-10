const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: 'string',
    email: 'string',
    password: 'string',
    favs: 'array',
});

const User = mongoose.model('User', userSchema);

module.exports = User;