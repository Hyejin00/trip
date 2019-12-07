var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const Place = require('../models/place');

router.get('/user',catchErrors(async(req,res,next)=>{
  const users = await User.find({});
  res.render('manager/user', {users:users});
}));

router.get('/offer', catchErrors(async(req,res,next)=>{
  // const contry = await Place.find().distinct('contry');
  // var place = {};
  // for(var index_contry in contry){
  //   var city = await Place.find({contry:contry[index_contry]});
  //   var cities = [];
  //   for(var index_city in city){
  //     cities[index_city] = city[index_city].city; 
  //   }
  //   place[contry[index_contry]] = cities; 
  // }
  var place = await Place.find({});
  console.log(place);
  //시간 javascript 참고
  res.render('manager/offer', {place:place});
}));

router.post('/offer_place', catchErrors(async(req,res,next)=>{
  const place_t = await Place.find({contry:req.body.contry});
  
  if(place_t.length>0){
    const place = await Place.findById(place_t[0]._id);
    place.city.push(req.body.city);
    console.log(place);
    await place.save();
    
    
  }else{
    var newplace = await new Place({
      contry:req.body.contry,
      city:[req.body.city]
    });
    await newplace.save();
  }
  res.redirect('/managers/offer');
}));

router.get('/new', function(req,res){

});

router.get('/:id/edit', function(req,res){

});

module.exports = router;