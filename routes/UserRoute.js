const express = require('express');
const User = require('./UserDocument');
const Lottery = require('./LotteryDocument');
const router = express.Router();
var jwt = require('jsonwebtoken');
const checkIfAuthenticated = require('./AuthUtil');



function contains(list, id){
    var i;
    for(i=0; i<list.length; i++){
        if(list[i]._doc.name === id){
            return true;
        }
    }
    return false;
}



router.get('/getUserInfo', checkIfAuthenticated, async (req, res) => {

    const user_id_temp = req.user.user_id;
    const userToFind = await User.findOne({user_id : user_id_temp});

    if (!userToFind) {
        res.json({message: 'Böyle bir kullanıcı bulunamadı.'});
        return;

    }

    let lotteries = await Lottery.find();
    let favLotteries = await userToFind.favs;

    var i;
    var j;
    for (i = 0; i < favLotteries.length; i++) {
        const id = favLotteries[i]._id.toString();
        if (contains(lotteries, id)) {
            favLotteries[i].isFaved = true;
        } else {
            favLotteries.splice(i, 1);
        }
    }

    let userUpdated = await User.findOneAndUpdate({user_id: user_id_temp}, {favs: userToFind.favs}, {
        new: true,
        upsert: true
    });

    res.json({user: userUpdated});

});
router.post('/signup', checkIfAuthenticated, async (req, res) => {

    const user_id_temp =  req.user.user_id;
    const user_name_surname =  req.body.name;
    const user = await User.findOne({user_id : user_id_temp });
    if(user){
        res.json({message: 'Böyle bir kullanıcı zaten var.', status: 0});
        return;
    }
    const userDoc = new User({user_id: user_id_temp, name: user_name_surname, favs: []});
    await userDoc.save();
    res.json({message: 'Kayıt oluşturuldu.', status: 1});


});

module.exports = router;