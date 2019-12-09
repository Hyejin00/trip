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
      req.flash('danger','이미 가입되어있는 회원입니다.');
      return res.redirect('back');
    }
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (err) {
        return next(err);
      } else {
        req.flash('success','가입을 축하합니다');
        res.redirect('/');
      }
    });
  }));
}));

//주문 리스트
router.get('/order',catchErrors(async(req, res, next) =>{
  res.render();
}));

//주문 생성
router.post('/new/order/:id',catchErrors(async(req, res, next) =>{
  const newOrder = new Order({
    order: req.session.user._id,
    num_people: req.body.num_people,
    tour: req.params.id,
    guide: req.body.guide
  });

  await newOrder.save();
  res.redirect('/users/order');
}));

router.get('/:id/edit',function(req,res){
  res.render('user/edit');
});

router.delete('/:id',catchErrors(async(req, res, next) =>{
  await User.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Deleted Successfully.');
  res.redirect('managers/user');
}));

module.exports = router;
