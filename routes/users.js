var express = require('express'),
    User = require('../models/user');
const catchErrors = require('../lib/async-error');
var router = express.Router();

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('user/new');
});

router.post('/new', catchErrors(async(req, res, next) =>{
  User.findOne({email: req.body.email}, catchErrors(async(err, user) =>{
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash('alert','이미 가입되어있는 회원입니다.');
      
      return res.redirect('back');
    }
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    await newUser.save(function(err) {
      if (err) {
        return next(err);
      } else {
        req.flash('alert','가입을 축하합니다');
        res.redirect('/');
      }
    });
  }));
}));

module.exports = router;
