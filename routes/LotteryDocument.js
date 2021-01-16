const mongoose = require('mongoose');

const LotterySchema = new mongoose.Schema({
    name: 'string',
    category: 'string',
    link: 'string',
    photo_link: 'string',
    isFaved: 'boolean',
});

const Lottery = mongoose.model('Lottery', LotterySchema);

module.exports = Lottery;