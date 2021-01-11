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

function indexOfElement(list,element){
    var i;
    for(i = 0; i<list.length; i++){
        if(list[i].name === element.name){
            return i;
        }
    }
    return -1;
}

router.put('/setFaved', async (req, res) => {
    let {_id, isFaved} = req.body;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const decodedToken = jwt.verify(authHeader, 'mero');
        const username = decodedToken.username;
        const user = await User.findOne({username: username});

        if (user) {
            if (isFaved) {
                const lottery = await Lottery.findOne({_id: _id});
                lottery.isFaved = true;
                user.favs.push(lottery);
            } else {
                const lottery = await Lottery.findOne({_id: _id});
                const index = indexOfElement(user.favs,lottery._doc);
                user.favs.splice(index, 1);
            }
        } else {
            res.status(200).json({message: 'Unauthorized'});
        }


        let user2 = await User.findOneAndUpdate({username: username}, {favs: user.favs}, {
            new: true,
            upsert: true
        });
        res.json(user2);
        return;
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