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

router.post('/signup', (req, res) => {
    const body = req.body;
    const userDoc = new User({username: body.username,email: body.email, password: body.password, favs: []});
    if( body.password.length <= 10 && body.password.length >= 4  ){
        userDoc.save();
        res.json({
            message: "Kayıt Oluşturuldu",
            status: 1
        });
        return;
    }else{
        res.json({
        message: "Şifreniz 4 ile 10 karakter arasında olmalıdır",
        status: 0
    });

    }

});

module.exports = router;