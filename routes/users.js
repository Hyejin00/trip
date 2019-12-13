var express = require('express');
const catchErrors = require('../lib/async-error');
var needAuth = require('../lib/needauth');
var router = express.Router();

var User = require('../models/user');
var Order = require('../models/order');


/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('user/new');
});

router.post('/new', catchErrors(async(req, res, next) =>{
  // var err = validateForm(req.body, {needPassword: true});
  // if (err) {
  //   req.flash('danger', err);
  //   return res.redirect('back');
  // }
  var user = await User.findOne({email: req.body.email});
  console.log('USER???', user);
  if (user) {
    req.flash('danger', 'Email address already exists.');
    return res.redirect('back');
  }
  user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  user.password = await user.generateHash(req.body.password);
  await user.save();
  req.flash('success', 'Registered successfully. Please sign in.');
  res.redirect('/');
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
