const express = require('express');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const User = require('./UserDocument');
const Lottery = require('./LotteryDocument');
const checkIfAuthenticated = require('./AuthUtil');


const router = express.Router();

function contains(list, name){
    var i;
    for(i=0; i<list.length; i++){
        if(list[i]._doc.name === name){
            return true;
        }
    }
    return false;
}

function contains2(list, name){
    var i;
    for(i=0; i<list.length; i++){
        if(list[i].name === name){
            return true;
        }
    }
    return false;
}


function indexOfElement(list,element){
    var i;
    for(i = 0; i<list.length; i++){
        if(list[i].name === element.name){
            return i;
        }
    }
    return -1;
}

router.put('/setFaved',  checkIfAuthenticated, async (req, res) => {
        let {_id, isFaved} = req.body;

    const user_id_temp = await req.user.user_id;
    const user = await User.findOne({user_id : user_id_temp});

        if (!user) {
            res.status(200).json({message: 'Böyle bir kullanıcı bulunamadı.'});
            return;
        }

        if (isFaved) {
            const lottery = await Lottery.findOne({_id: _id});
            lottery.isFaved = true;
            user.favs.push(lottery);
        } else {
            const lottery = await Lottery.findOne({_id: _id});
            const index = indexOfElement(user.favs, lottery._doc);
            user.favs.splice(index, 1);
        }


        let user2 = await User.findOneAndUpdate({user_id : user_id_temp}, {favs: user.favs}, {
            new: true,
            upsert: true
        });
        res.json(user2);

});


router.post('/getLotteriesOf', checkIfAuthenticated, async (req, res) => {
        const {category} = req.body;

        const user_id_temp = await req.user.user_id;
        const user = await User.findOne({user_id : user_id_temp});

        if (!user) {
            res.status(200).json({message: 'Böyle bir kullanıcı bulunamadı.'});
            return;
        }

        let userFavLotteries = await user.favs;
        let lotteries = await Lottery.find({category: category});

        var i;
        for (i = 0; i < lotteries.length; i++) {
            lotteries[i].isFaved = contains2(userFavLotteries, lotteries[i]._doc.name);

        }
        res.json({lotteries});


});

router.post('/post', (req, res) => {
        const body = req.body;
        const lottery = new Lottery({
            name: body.name,
            category: body.category,
            link: body.link,
            photo_link: body.photo_link,
            isFaved: body.isFaved
        });
        lottery.save();
        res.json(body);
});

router.get('/getAllLotteries', checkIfAuthenticated, async (req, res) => {

    const user_id_temp = await req.user.user_id;
    const user = await User.findOne({user_id : user_id_temp});

        if (!user) {
            res.status(200).json({message: 'Böyle bir kullanıcı bulunamadı.'});
            return;
        }

        let userFavLotteries = await user.favs;
        let lotteries = await Lottery.find();

        var i;
        for (i = 0; i < lotteries.length; i++) {
            lotteries[i].isFaved = contains2(userFavLotteries, lotteries[i]._doc.name);

        }
        res.json({lotteries});


});



router.get('/getAllLotteriesNoLogin',  async (req, res) => {


    let lotteries = await Lottery.find();

    var i;
    for (i = 0; i < lotteries.length; i++) {
        lotteries[i].isFaved = false;

    }
    res.json({lotteries});


});

router.post('/getLotteriesOfNoLogin', async (req, res) => {
    const {category} = req.body;
    let lotteries = await Lottery.find({category: category});

    var i;
    for (i = 0; i < lotteries.length; i++) {
        lotteries[i].isFaved = false;

    }
    res.json({lotteries});


});


module.exports = router;