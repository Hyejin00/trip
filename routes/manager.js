var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var User = require('../models/user');
var Place = require('../models/place');
var Tour = require('../models/tour');
var needAuth = require('../lib/needauth');

//-----유저관리
router.get('/user',catchErrors(async(req,res,next)=>{
  const users = await User.find({});
  res.render('manager/user', {users:users});
}));

router.get('/user/new', function(req,res){
  res.render('manager/new_user');
});

router.post('/user/new',catchErrors(async(req,res,next)=>{
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  });
  user.password = await user.generateHash(req.body.password);
  await user.save();
  res.redirect('/managers/user');
}));

router.get('/user/:id',catchErrors(async(req,res,next)=>{
  const user =  await User.findById(req.params.id);
  res.render('manager/edit',{user:user});
}));

router.post('/user/:id',catchErrors(async(req,res,next)=>{
  const user =  await User.findById(req.params.id);
  user.name = req.body.name;
  user.role = req.body.role;
  await user.save();
  res.redirect('/managers/user');
}));
router.delete('/:id',catchErrors(async(req,res,next)=>{
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/managers/user');
}));

//장소관리
router.get('/offer_place', catchErrors(async(req,res,next)=>{
  var place = await Place.find({});
  console.log(place);
  //시간 javascript 참고
  res.render('manager/offer_place', {places:place});
}));
//상품관리- 나라 도시 추가 파트
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

//--상품관리

router.get('/offer', catchErrors(async(req,res,next)=>{
  var tour = await Tour.find({}).populate('guide');
  res.render('manager/tour_list',{tours:tour});
}));

router.delete('/offer/:id', catchErrors(async(req,res,next)=>{
  await Tour.findByIdAndDelete(req.params.id);
  res.redirect('/managers/offer');
}));
module.exports = router;