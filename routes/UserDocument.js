const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: 'string' ,
    favs: 'array',
});

const User = mongoose.model('User', userSchema);

module.exports = User;