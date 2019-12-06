var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const Guide = require('../models/guide');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signin', function(req,res,next){
  res.render('signin');
});

router.post('/signin', catchErrors(async(req, res, next) =>{
  await User.findOne({email: req.body.email}, catchErrors(async(err, user) =>{
    if (err) {
      res.render('error', {message: "Error", error: err});
    } else if (!user || user.password !== req.body.password) {
      req.flash('danger','아이디 또는 비밀번호가 맞지않습니다.');
      res.redirect('back');
    } else {
      req.session.user = user;
      if(user.role === 'guide'){
        await Guide.findOne({user: user._id}, function(err, guide) {
        if (err) {
          res.render('error', {message: "Error", error: err});
        } else if (guide){
          req.session.guide = guide;
          req.flash('success',`환영합니다! ${user.name}`);
          res.redirect('/');
        }});}
  }}));
}));

// 관리자, 가이드,유저 일때 구현해야함.(함수로 분리하기)

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  req.flash('info','성공적으로 로그아웃 되었습니다')
  res.redirect('/');
});

module.exports = router;
