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
            message: "Giriş Yapıldı :)",
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

function contains(list, name){
    var i;
    for(i=0; i<list.length; i++){
        if(list[i]._doc.name === name){
            return true;
        }
    }
    return false;
}



router.get('/getUserInfo', async (req, res) => {
    const authHeader = req.headers.authorization;

    const decodedToken = jwt.verify(authHeader, 'mero');
    const username = decodedToken.username;

    const user2 = await User.findOne({ username: username });


    if (user2) {
        let lotteries = await Lottery.find();
        let lotteries2 = await user2.favs;

        var i;
        var j;
        for (i = 0; i < lotteries2.length; i++) {
            const name = lotteries2[i].name;
            if(contains(lotteries, name)){
                lotteries2[i].isFaved = true;
            }
            else {
                lotteries2.splice(i,1);
            }
        }

        let user = await User.findOneAndUpdate({username: username}, {favs : user2.favs}, {
            new: true,
            upsert: true
        });

        res.json({user});


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