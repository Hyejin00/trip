var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const Guide = require('../models/guide');
const Place = require('../models/place');
const Tour = require('../models/tour');

function needAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

router.get('/new', needAuth, function(req, res) {
    res.render('guide/new');
  });
// { type: Schema.Types.ObjectId, ref: 'User' }
router.post('/new',catchErrors(async(req, res, next) =>{
  const current_user = req.session.user;
  var newGuide = new Guide({
    user:current_user._id,
    name: req.body.guide_name,
    profile: req.body.guide_profile,
    kakao_id: req.body.kakao_id,
    tele: req.body.tel,
    profile_photo: req.body.guide_photo
  });
  await newGuide.save();
  const user = await User.findById(current_user._id);
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
  req.session.user = user;
  req.flash('success','가이드 등록이 완료되었습니다.');
  res.redirect('/');
}));

//나의상품목록

router.get('/offer',catchErrors(async(req, res, next) =>{
  res.render('guide/offer');
}));

//Tour 만들기
router.get('/offer/new',catchErrors(async(req, res, next) =>{
  const place = await Place.find().distinct('contry');
  console.log(place);
  res.render('guide/offer_new',{contry:place});
}));

router.get('/city_option',catchErrors(async(req, res, next) =>{
  let c = req.query.c ? req.query.c : '';
  if(!c){
    return res.json([]);
  }
  const city = await Place.find({contry:c}).distinct('city');
  console.log(city);
  console.log('-----in router');
  
  
  res.json(city);
}));

router.post('/offer/new',catchErrors(async(req, res, next) =>{
  var place = await Place.findOne({contry: req.body.contry, city: req.body.city});
  console.log(place);
  
  var newTour = new Tour({
    guide: req.session.guide._id,
    place: place._id,
    title: req.body.title,
    description: req.body.description,
    main_photo: req.body.main_photo,
    price: req.body.price,
    num_read: 0,
    num_wishlist: 0 ,
    max_num_people: req.body.max_people
  });

  const save_tour = await newTour.save();
  console.log(save_tour);
  res.redirect(`/guides/offer/${save_tour._id}`);
  
}));

//코스 등록하기

router.get('/offer/:id',function(req,res,next){
  res.render('guide/offer_course_new',{tour_id: req.params.id});
});

router.post('/offer/:id',catchErrors(async(req, res, next) =>{
  
}));

//가이드 정보관리

router.get('/:id', catchErrors(async(req, res, next) =>{ 
  const guide = await Guide.findById(req.params.id);
  res.render('guide/edit',{guide:guide});
}));

router.put('/:id',catchErrors(async(req, res, next) =>{
  const guide = await Guide.findById(req.params.id);
  if (!guide) {
    return res.redirect('back');
  }
  guide.profile_photo = req.body.guide_photo;
  guide.tele = req.body.tel;
  guide.kakao_id = req.body.kakao_id;
  guide.profile = req.body.guide_profile;
  guide.name = req.body.guide_name;

  await guide.save();
  res.redirect(`/guides/${req.params.id}`);
}));

module.exports = router;