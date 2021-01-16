const mongoose = require('mongoose');

const TopTenSchema = new mongoose.Schema({
    info: 'string',
    topTenIds: 'array'
});

const TopTen = mongoose.model('TopTen', TopTenSchema);

module.exports = TopTen;
