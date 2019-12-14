var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var Place = require('../models/place');
var Tour = require('../models/tour');
var Course = require('../models/course');
var needAuth = require('../lib/needauth');

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

  //----------상품 dp

  router.get('/display',catchErrors(async(req, res, next) =>{
    const tours = await Tour.find({});
    console.log(tours);
    
    res.render('tour/display',{tours:tours});
  }));
  //-------수정

  router.get('/edit_tour/:id',catchErrors(async(req, res, next) =>{
    const tour = await Tour.findOne({_id: req.params.id});
    const place = await Place.find().distinct('contry');
    const city = await Place.find({contry:tour.contry}).distinct('city');
    console.log(tour);
    console.log(place);
    
    res.render('tour/tour_edit',{tour:tour, place:place, pre_city:city});
  }));

  router.put('/edit_tour/:id',catchErrors(async(req, res, next) =>{
    const tour= await Tour.findById(req.params.id);
    if (!tour) {
      return res.redirect('back');
    }
    tour.contry = req.body.contry;
    tour.city = req.body.city;
    tour.title = req.body.title;
    tour.description = req.body.description;
    tour.name = req.body.title;
    tour.main_photo= req.body.main_photo;
    tour.price= req.body.price;
    tour.max_num_people= req.body.max_people;
  
    await tour.save();
    res.redirect(`/tours/edit_course/${req.params.id}`);
  }));

  router.get('/edit_course/:id',catchErrors(async(req, res, next) =>{
    const course = await Course.findOne({tour: req.params.id});
    res.render('tour/course_edit',{coursies:course});
  }));

  router.put('/edit_course/:id',catchErrors(async(req, res, next) =>{
    const course = await Course.findById(req.params.id);
    if(!course){
      return res.redirect('/guides/offer/list');
    }else{
      var edit_course_items = [];
      for(var i = 0; i<req.body.title.length; i++){
        var edit_item = {
          title:req.body.title[i],
          require_hour: req.body.hour[i],
          require_minute: req.body.minute[i],
          description: req.body.description[i],
          photo: req.body.photo[i]
        }
        edit_course_items.push(edit_item);
      }
    }
    course.course_items = edit_course_items;
    await course.save();
    res.redirect(`/guides/offer/list`);
  }));

  //삭제

  router.delete('/:id',catchErrors(async(req, res, next) =>{
    await Course.findOneAndRemove({tour:req.params.id});
    await Tour.findOneAndRemove({_id:req.params.id});
    req.flash('success', 'Deleted Successfully.');
    res.redirect('/guides/offer/list');
  }));




module.exports = router;