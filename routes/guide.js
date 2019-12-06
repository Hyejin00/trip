var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const Guide = require('../models/guide');

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
  await newGuide.save(function(err) {
    if (err) {
      return next(err);
    }
  });
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

router.get('/offer',function(req,res,next){
  res.render('guide/offer_new');
});

router.get('/offer/:id',function(req,res,next){
  res.render('guide/offer');
});

router.get('/:id', catchErrors(async(req, res, next) =>{
  const guide = await Guide.findById(req.params.id);
  res.render('guide/edit',{guide:guide});
}));

router.put('/:id',catchErrors(async(req, res, next) =>{
  const guide = await Guide.findById(req.params.id);
  console.log(guide);
  
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