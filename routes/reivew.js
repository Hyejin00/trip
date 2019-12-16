var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var Place = require('../models/place');
var Tour = require('../models/tour');
var Course = require('../models/course');
var Order = require('../models/order');
var Review = require('../models/review');
var needAuth = require('../lib/needauth');

router.post('/:tour_id',needAuth,catchErrors(async(req, res, next) =>{
    var order = await Order.find({order:req.user,tour:req.params.tour_id});
    console.log(order);
    if(order.length === 0){
      req.flash('danger','여행 상품 구입을 먼저 해주세요 :)');
      return res.redirect('back');
    }else{
      if(!req.body.title || !req.body.review_body){
        req.flash('danger','제목과 내용은 꼭 기입해주세요.');
        return res.redirect('back');
      }
      const newReview = new Review({
        user: req.user,
        tour: req.params.tour_id,
        photo: req.body.photo,
        title: req.body.title,
        description:req.body.review_body
      }); 
      await newReview.save();
      res.redirect(`/tours/show/${req.params.tour_id}`);
    }
}));

router.delete('/:id',needAuth,catchErrors(async(req, res, next) =>{
    await Review.findByIdAndDelete(req.params.id);
    if(req.user.role === 'manager'){
        return res.redirect('/managers/review');
    }
    res.redirect('/users/review');
}));

  module.exports = router;