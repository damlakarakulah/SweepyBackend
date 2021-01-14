const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: 'string' ,
    name: 'string',
    favs: 'array',
});

const User = mongoose.model('User', userSchema);

module.exports = User;