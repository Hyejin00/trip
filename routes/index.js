var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signin', function(req,res,next){
  res.render('signin');
});

router.post('/signin', function(req,res,next){
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.render('error', {message: "Error", error: err});
    } else if (!user || user.password !== req.body.password) {
      req.flash('danger','아이디 또는 비밀번호가 맞지않습니다.');
      res.redirect('back');
    } else {
      req.session.user = user;
      req.flash('success',`환영합니다! ${user.name}`);
      res.redirect('/');
    }
  });
});

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  req.flash('info','성공적으로 로그아웃 되었습니다')
  res.redirect('/');
});

module.exports = router;
