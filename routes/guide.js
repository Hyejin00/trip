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

router.get('/:id', function(req, res, next){
  Guide.findOne({user:req.params.id}, catchErrors(async(err, guide) =>{
    if (err) {
      return next(err);
    }
    if (guide) {
      res.render('guide/edit',{guide:guide});
    }
  }));
});

router.post('/:id',function(req,res,next){
  Guide.findOne({user:req.params.id}, catchErrors(async(err, guide) =>{
    if (err) {
      return next(err);
    }
    if (guide) {
      res.redirect(`/guide/${req.params.id}`);
    }
  }));
});

module.exports = router;