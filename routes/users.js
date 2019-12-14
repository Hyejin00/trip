var express = require('express');
const catchErrors = require('../lib/async-error');
var needAuth = require('../lib/needauth');
var router = express.Router();

var User = require('../models/user');
var Order = require('../models/order');
var Wishlist = require('../models/wishlist');


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
//user 정보관리

router.get('/info',catchErrors(async(req, res, next) =>{
  const user = await User.findById(req.user._id);
  res.render('user/edit',{user:user});
}));

router.post('/info/:id',catchErrors(async(req, res, next) =>{
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.redirect('back');
  }
  user.name = req.body.name;
  await user.save();
  res.redirect(`/users/info`);
}));

//주문 리스트
router.get('/order',catchErrors(async(req, res, next) =>{
  const orders = await Order.find({order:req.user._id}).populate('tour');
  res.render('user/order_list',{orders:orders});
}));

router.get('/order/edit',catchErrors(async(req, res, next) =>{
  const orders = await Order.find({order:req.user._id}).populate('tour');
  res.render('user/order_list_edit',{orders:orders});
}));

router.put('/order/edit/:id',catchErrors(async(req, res, next) =>{
  const order = await Order.findById(req.params.id);
  order.num_people=req.body.num_people;
  order.order_date=req.body.order_date;
  await order.save();
  res.redirect('/users/order');
}));

router.delete('/order/:id',catchErrors(async(req, res, next) =>{
  await Order.findOneAndRemove({_id: req.params.id});
  res.redirect('/users/order');
}));

//주문 생성
router.post('/new/order/:id',catchErrors(async(req, res, next) =>{
  const newOrder = new Order({
    order: req.user._id,
    num_people: req.body.num_people,
    order_date:req.body.date,
    price:req.body.num_people*req.body.price,
    tour: req.params.id,
    guide: req.body.guide
  });

  await newOrder.save();
  res.redirect('/users/order');
}));

//장바구니 ---아이템이 없을 경우 처리

router.get('/wish',catchErrors(async(req, res, next) =>{
  const wishs = await Wishlist.find({user:req.user._id}).populate('tour');
  res.render('user/wishlist',{wishlist:wishs});
}));

router.get('/wish/:id',catchErrors(async(req, res, next) =>{
  const newWishlist = new Wishlist({
    user: req.user._id,
    tour: req.params.id
  });

  await newWishlist.save();
  req.flash('success', '장바구니에 담겼습니다.');
  res.redirect(`/tours/show/${req.params.id}`);
}));

//매니저리스트

router.delete('/:id',catchErrors(async(req, res, next) =>{
  await User.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Deleted Successfully.');
  res.redirect('managers/user');
}));

module.exports = router;
