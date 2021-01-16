const express = require('express');
const mongoose = require('mongoose');
const TopTen = require('./TopTenDocument');
const Lottery = require('./LotteryDocument');
const router = express.Router();


function contains(list, id){
    var i;
    for(i=0; i<list.length; i++){
        if(list[i]._doc._id.toString() === id){
            return true;
        }
    }
    return false;
}



router.post('/post',  async (req, res) => {

    const object1 = req.body.obj1;
    const object2 = req.body.obj2;
    const object3 = req.body.obj3;
    const object4 = req.body.obj4;
    const object5 = req.body.obj5;
    const object6 = req.body.obj6;
    const object7 = req.body.obj7;
    const object8 = req.body.obj8;
    const object9 = req.body.obj9;
    const object10 =req.body.obj10;

    var toptenArray = [object1, object2, object3, object4, object5, object6, object7, object8, object9, object10]
    let allLotteries = await Lottery.find();

    var i;
    for(i=0; i<toptenArray.length; i++){
        if(!contains(allLotteries,toptenArray[i])){
            res.json({cantFindLottery : toptenArray[i]});
            return;
        }
    }

    const topten = new TopTen({
        info : 'toptens',
        topTenIds: toptenArray
    });

    let toptenObjects = TopTen.find()

    if(toptenObjects.length === 0)
        topten.save();
    else{
        let topTensUpdated = await TopTen.findOneAndUpdate({info: 'toptens'}, {topTenIds: toptenArray}, {
            new: true,
            upsert: true
        });
        res.json(topTensUpdated);
    }
});

router.post('/changeTopten',  (req, res) => {

    const object1 = req.body.obj1;
    const object2 = req.body.obj2;
    const object3 = req.body.obj3;
    const object4 = req.body.obj4;
    const object5 = req.body.obj5;
    const object6 = req.body.obj6;
    const object7 = req.body.obj7;
    const object8 = req.body.obj8;
    const object9 = req.body.obj9;
    const object10 =req.body.obj10;

    var toptenArray = [object1, object2, object3, object4, object5, object6, object7, object8, object9, object10]

    const topten = new TopTen({
        topTenIds: toptenArray
    });

    topten.save();

    res.json();
});



module.exports = router;