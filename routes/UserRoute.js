const express = require('express');
const User = require('./UserDocument');

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

router.get('/getUserInfo', async (req, res) => {
    const authHeader = req.headers.authorization;

    const decodedToken = jwt.verify(authHeader, 'mero');
    const username = decodedToken.username;

    const user = await User.findOne({ username: username });


    if (user) {
        let lotteries2 = await user.favs;

        var j;
        for(j = 0; j<lotteries2.length; j++) {
            lotteries2[j].isFaved = true;
        }

        res.json({user});
        return;

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