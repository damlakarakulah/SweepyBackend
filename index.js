const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cors = require('cors');
const checkIfAuthenticated = require('./routes/AuthUtil');

const userRoute = require('./routes/UserRoute.js');
const lotteryRoute = require('./routes/LotteryRoute.js');

const app = express();

mongoose.connect("mongodb+srv://ege:12345@cluster0.poypn.mongodb.net/ege?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.json());

app.use(Cors());
app.use('/user', userRoute);
app.use('/lottery', lotteryRoute);

app.get('/test', checkIfAuthenticated, (req, res) => {
    res.json(req.user);
});

app.get('/', (req, res) => {
    return res.json({message: 'Hello World'});
});

app.listen(process.env.PORT || 8080, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});