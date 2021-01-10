const express = require('express');
const User = require('./UserDocument');
const Lottery = require('./LotteryDocument');

const router = express.Router();
var jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({ username: username });
    if (user && user.password === password) {
        const token = jwt.sign({ username: user.username }, 'mero');
        res.json({
            message: "Giriş Yapıldı",
            token: token,
            status: 1
        });
    } else {
        res.status(200).json({
            message: 'Kullanıcı adınız veya şifreniz yanlış :(',
            status: 0
        });
    }

});

router.put('/getUserInfo', async (req, res) => {
    const authHeader = req.headers.authorization;

    const decodedToken = jwt.verify(authHeader, 'mero');
    const username = decodedToken.username;

    const user2 = await User.findOne({ username: username });


    if (user2) {
        let lotteries = await Lottery.find();
        let lotteries2 = await user2.favs;

        var i;
        var j;
        for (i = 0; i < lotteries.length; i++) {
            const name = lotteries[i].name;
            for(j = 0; j<lotteries2.length; j++) {
                if(name === lotteries2[j].name){
                    lotteries2[j].isFaved = true;

                    let user = await User.findOneAndUpdate({username: username}, {favs : user2.favs}, {
                        new: true,
                        upsert: true
                    });

                    res.json({user});
                    return;
                }
                else{
                    lotteries2.splice(user2.favs[j],1);

                    let user = await User.findOneAndUpdate({username: username}, {favs : user2.favs}, {
                        new: true,
                        upsert: true
                    });

                    res.json({user});
                    return;
                }
            }
        }


    } else {
        res.json({message: 'Böyle bir kullanıcı bulunamadı.'});
    }

});
router.post('/signup', async (req, res) => {
    const body = req.body;
    let tempUsername = body.username;
    let tempEmail = body.email;

    let user = await User.findOne({username: tempUsername});
    let user2 = await User.findOne({email: tempEmail});
    if(user){
        res.json({
            message: "Bu kullanıcı adı zaten mevcut.",
            status: 0
        });
    }
    else if(user2){
        res.json({
            message: "Bu e-mail ile eşleşmiş bir kullanıcı zaten mevcut.",
            status: 0
        });
    }
    else{
        const userDoc = new User({username: tempUsername, email: body.email, password: body.password, favs: []});
        userDoc.save();
        res.json({
            message: "Kayıt oluşturuldu.",
            status: 1
        });
    }

});

module.exports = router;