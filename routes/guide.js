var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var User = require('../models/user');
var Guide = require('../models/guide');
var Order = require('../models/order');
var Tour = require('../models/tour');
var needAuth = require('../lib/needauth');


router.get('/new', needAuth, function(req, res) {
    res.render('guide/new');
  });
// { type: Schema.Types.ObjectId, ref: 'User' }
router.post('/new',catchErrors(async(req, res, next) =>{
  var newGuide = new Guide({
    user:req.user._id,
    name: req.body.guide_name,
    profile: req.body.guide_profile,
    kakao_id: req.body.kakao_id,
    tele: req.body.tel,
    profile_photo: req.body.img
  });
  req.session.guide = await newGuide.save();
  const user = await User.findById(req.user._id);
  if(!user){
    req.flash('danger', 'please sign in again.');
    return res.redirect('/');
  }
  user.role = 'guide';
  await user.save(function(err) {
    if (err) {
      return next(err);
    }
  });
  req.user = user;
  req.flash('success','가이드 등록이 완료되었습니다.');
  res.redirect('/');
}));

//예약 관리
router.get('/order',catchErrors(async(req, res, next) =>{
  const orders = await Order.find({guide:req.session.guide._id}).populate('order tour');
  console.log(orders);
  
  res.render('guide/order_list',{orders:orders});
}));

router.delete('/order/:id',catchErrors(async(req, res, next) =>{
  await Order.findOneAndRemove({_id: req.params.id});
  res.redirect('/guides/order');
}));

//나의상품목록

router.get('/offer/list',catchErrors(async(req, res, next) =>{
  const tour = await Tour.find({guide:req.session.guide._id}).populate('place');
  console.log(tour);

  res.render('guide/offer',{tours:tour});
}));

//가이드 정보관리

router.get('/info', catchErrors(async(req, res, next) =>{ 
  const guide = await Guide.findById(req.session.guide._id);
  res.render('guide/edit',{guide:guide});
}));

router.put('/info',catchErrors(async(req, res, next) =>{
  const guide = await Guide.findById(req.session.guide._id);
  if (!guide) {
    return res.redirect('back');
  }
  guide.profile_photo = req.body.guide_photo;
  guide.tele = req.body.tel;
  guide.kakao_id = req.body.kakao_id;
  guide.profile = req.body.guide_profile;
  guide.name = req.body.guide_name;

  await guide.save();
  res.redirect(`/guides/info`);
}));

module.exports = router;