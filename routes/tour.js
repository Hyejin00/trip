var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const Guide = require('../models/guide');
const Place = require('../models/place');
const Tour = require('../models/tour');
const Course = require('../models/course');

//app에 추가하기
//tour 만들기
router.get('/new',catchErrors(async(req, res, next) =>{
    const place = await Place.find().distinct('contry');
    console.log(place);
    res.render('tour/tour_new',{contry:place});
  }));

router.get('/city_option',catchErrors(async(req, res, next) =>{
    let c = req.query.c ? req.query.c : '';
    if(!c){
      return res.json([]);
    }
    const city = await Place.find({contry:c}).distinct('city');
    console.log(city);
    console.log('-----in router');
    
    
    res.json(city);
  }));

router.post('/new',catchErrors(async(req, res, next) =>{
    var place = await Place.findOne({contry: req.body.contry, city: req.body.city});
    console.log(place);
    
    var newTour = new Tour({
      guide: req.session.guide._id,
      contry:req.body.contry,
      city:req.body.city,
      title: req.body.title,
      description: req.body.description,
      main_photo: req.body.main_photo,
      price: req.body.price,
      num_read: 0,
      num_wishlist: 0 ,
      max_num_people: req.body.max_people
    });
  
    const save_tour = await newTour.save();
    console.log(save_tour);
    res.redirect(`/tours/new/${save_tour._id}`);
    
  }));

  //course 만들기
  router.get('/new/:id',function(req,res,next){
    res.render('tour/course_new',{tour_id: req.params.id});
  });
  router.post('/new/:id',catchErrors(async(req, res, next) =>{
    var new_course_items = [];
    for(var i = 0; i<req.body.title.length; i++){
      var new_item = {
        title:req.body.title[i],
        require_hour: req.body.hour[i],
        require_minute: req.body.minute[i],
        description: req.body.description[i],
        photo: req.body.photo[i]
      }
      new_course_items.push(new_item);
    }
    var newCourse = new Course({
      tour: req.params.id,
      course_items: new_course_items
    });
  
    await newCourse.save();
  
    res.redirect(`/guides/offer/list`);
  }));

  //----------상세보기

  router.get('/show/:id',catchErrors(async(req, res, next) =>{
    const tour = await Course.findOne({tour:req.params.id}).populate({path:'tour',populate:{path: 'guide'}});
    console.log(tour);
    res.render('tour/show',{item:tour});
  }));
  //-------수정
  router.get('/edit/:id',catchErrors(async(req, res, next) =>{
    res.redirect(`/tours/show/${req.params.id}`);
  }));

  //삭제

  router.delete('/:id',catchErrors(async(req, res, next) =>{
    await Tour.findOneAndRemove({_id:req.params.id});
    req.flash('success', 'Deleted Successfully.');
    res.redirect('/guides/offer/list');
  }));




module.exports = router;