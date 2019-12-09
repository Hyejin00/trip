var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const Guide = require('../models/guide');
const Place = require('../models/place');
const Tour = require('../models/tour');
const Course = require('../models/course');

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