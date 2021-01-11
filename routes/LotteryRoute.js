const express = require('express');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const User = require('./UserDocument');
const Lottery = require('./LotteryDocument');

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

router.put('/setFaved', async (req, res) => {
    const authHeader = req.headers.authorization;
    const {_id,isFaved} = req.body;
    const decodedToken = jwt.verify(authHeader, 'mero');
    const username = decodedToken.username;


    const user2 = await User.findOne({ username: username });


    if (user2) {
        const tempLottery = await Lottery.findById(_id);
        let lotteries2 = await user2.favs;

        var i;
        var j;
        for (i = 0; i < lotteries2.length; i++) {
            const name = lotteries2[i].name;
            if (tempLottery._doc.name === name) {
                if (isFaved === "false") {
                    lotteries2.splice(i, 1);
                    break;
                }
            }
        }

        if(isFaved === "true") {
            tempLottery._doc.isFaved = true;
            lotteries2.push(tempLottery._doc);
        }

        let user = await User.findOneAndUpdate({username: username}, {favs : lotteries2}, {
            new: true,
            upsert: true
        });

        res.json(user);


    } else {
        res.json({message: 'Böyle bir kullanıcı bulunamadı.'});
    }

});



router.post('/getLotteriesOf', async (req, res) => {
    const authHeader = req.headers.authorization;
    const {category} = req.body;

    if (authHeader) {
        const decodedToken = jwt.verify(authHeader, 'mero');
        const username = decodedToken.username;

        const user = await User.findOne({username: username})
        let lotteries = await Lottery.find({category: category});
        let lotteries2 = await user.favs;

        var i;
        var j;
        for (i = 0; i < lotteries.length; i++) {
            const name = lotteries[i].name;
            for(j = 0; j<lotteries2.length; j++) {
                if(name === user.favs[j].name){
                    lotteries[i].isFaved = true;
                }
                else{
                    lotteries[i].isFaved = false;
                }
            }
        }
        res.json({lotteries});
        return;
    } else {
        res.status(200).json({message: 'Unauthorized'});
    }
});

router.post('/post', (req, res) => {
    const body = req.body;
    const lottery = new Lottery ({ name: body.name,category: body.category, link: body.link, photo_link: body.photo_link, isFaved: body.isFaved });
    lottery.save();
    res.json(body);
});

router.get('/getAllLotteries', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const decodedToken = jwt.verify(authHeader, 'mero');
        const username = decodedToken.username;

        const user = await User.findOne({username: username})

        if (user) {
            let lotteries = await Lottery.find();
            let lotteries2 = await user.favs;

            var i;
            var j;
            for (i = 0; i < lotteries.length; i++) {
                const name = lotteries[i].name;
                for(j = 0; j<lotteries2.length; j++) {
                    if(name === user.favs[j].name){
                        lotteries[i].isFaved = true;
                    }
                    else{
                        lotteries[i].isFaved = false;

                    }
                }
            }

            res.json({lotteries});
            return;
        }
    } else {
        res.status(200).json({message: 'Unauthorized'});
    }
});


module.exports = router;