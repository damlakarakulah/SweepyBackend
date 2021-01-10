const express = require('express');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const User = require('./UserDocument');
const Lottery = require('./LotteryDocument');

const router = express.Router();



router.put('/setFaved', async (req, res) => {
    const {_id, isFaved} = req.body;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const decodedToken = jwt.verify(authHeader, 'mero');
        const username = decodedToken.username;
        const tempUser = await User.findOne({username: username});

        const tempLottery = await Lottery.findById(_id);


        if (tempUser) {
            const tempList = tempUser.favs;
            if(isFaved) {
                if(tempLottery) {
                    if(!tempList.includes(tempLottery)) {
                        tempLottery._doc.isFaved = true;
                        tempList.push(tempLottery);
                    }
                }
            }
            else {
                if(tempLottery) {
                    if(tempList.in(tempLottery))
                        tempLottery._doc.isFaved = false;
                    tempList.splice(tempLottery, 1);
                }
            }
            let user = await User.findOneAndUpdate({username: username}, {favs : tempList}, {
                new: true,
                upsert: true
            });
            res.json(user);
            return;
        }
    } else {
        res.status(403).json({message: 'Unauthorized'});
    }

});



router.post('/getLotteriesOf', async (req, res) => {
    const authHeader = req.headers.authorization;
    const {category} = req.body;

    if (authHeader) {
        let lotteries = await Lottery.find({category: category});
        res.json({lotteries});
        return;
    } else {
        res.status(200).json({message: 'Unauthorized'});
    }
});

router.post('/post', (req, res) => {
    const body = req.body;
    const lottery = new Lottery ({ name: body.name,category: body.category, link: body.link, photo_link: body.photo_link });
    lottery.save();
    res.json(body);
});

router.get('/getAllLotteries', async (req, res) => {
    const authHeader = req.headers.authorization;
    const category = req.params.category;
    /*res.json({message: category})
    return;

     */
    if (authHeader) {
        const decodedToken = jwt.verify(authHeader, 'mero');
        const username = decodedToken.username;

        const user = await User.findOne({username: username})

        if (user) {
            let lotteries = await Lottery.find();

            var i;
            for (i = 0; i < lotteries.length; i++) {
                lotteries[i]._doc.isFaved = user.favs.includes(lotteries[i]);
            }

            res.json({lotteries});
            return;
        }
    } else {
        res.status(200).json({message: 'Unauthorized'});
    }
});


module.exports = router;