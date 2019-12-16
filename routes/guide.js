var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var User = require('../models/user');
var Guide = require('../models/guide');
var Order = require('../models/order');
var Tour = require('../models/tour');
var needAuth = require('../lib/needauth');

function validateForm(form) {
  
  if (!form.guide_name || !form.guide_profile|| !form.tel) {
    return '이름, 프로필, 전화번호를 입력해주세요.';
  }
  if(isNaN(parseInt(form.tel))){
    return '전화번호는 숫자로 적어주세요.'
  }

  return null;
}

router.get('/new', needAuth, function(req, res) {
    res.render('guide/new');
  });
// { type: Schema.Types.ObjectId, ref: 'User' }
router.post('/new',needAuth,catchErrors(async(req, res, next) =>{
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
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
  await user.save();
  req.flash('success','가이드 등록이 완료되었습니다. 다시 로그인 해주세요.');
  res.redirect('/signout');
}));

//예약 관리
router.get('/order', needAuth,catchErrors(async(req, res, next) =>{
  const orders = await Order.find({guide:req.session.guide._id}).populate('order tour');
  console.log(orders);
  
  res.render('guide/order_list',{orders:orders});
}));

router.delete('/order/:id',catchErrors(async(req, res, next) =>{
  await Order.findOneAndRemove({_id: req.params.id});
  res.redirect('/guides/order');
}));

router.get('/order/edit', needAuth,catchErrors(async(req, res, next) =>{
  const orders = await Order.find({order:req.user._id}).populate('tour');
  res.render('guide/order_list_edit',{orders:orders});
}));

router.put('/order/edit/:id',catchErrors(async(req, res, next) =>{
  if(!req.body.num_people||!req.body.order_date){
    req.flash('danger', '인원, 날짜는 필수 항목입니다.');
    return res.redirect('back');
  }
  if(isNaN(parseInt(req.body.num_people))){
    req.flash('danger', '인원은 숫자만 기입해주세요.');
    return res.redirect('back');
  }
  const order = await Order.findById(req.params.id).populate('tour');
  order.num_people=req.body.num_people;
  order.order_date=req.body.order_date;
  order.price = order.tour.price *req.body.num_people;
  await order.save();
  res.redirect('/guides/order');
}));

//나의상품목록

router.get('/offer/list', needAuth,catchErrors(async(req, res, next) =>{
  const tour = await Tour.find({guide:req.session.guide._id}).populate('place');
  console.log(tour);

  res.render('guide/offer',{tours:tour});
}));

//가이드 정보관리

router.get('/info', needAuth, catchErrors(async(req, res, next) =>{ 
  const guide = await Guide.findById(req.session.guide._id);
  res.render('guide/edit',{guide:guide});
}));

router.put('/info',catchErrors(async(req, res, next) =>{
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
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