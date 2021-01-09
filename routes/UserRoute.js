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
            message: "Başarılı",
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
        res.json({user});
    } else {
        res.json({message: 'Böyle bir kullanıcı bulunamadı.'});
    }

});

router.post('/signup', (req, res) => {
    const body = req.body;
    const userDoc = new User({username: body.username, password: body.password, favs: []});
    userDoc.save();
    res.json(body);
});

module.exports = router;