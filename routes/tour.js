var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var Place = require('../models/place');
var Tour = require('../models/tour');
var Course = require('../models/course');
var Order = require('../models/order');
var Review = require('../models/review');
var needAuth = require('../lib/needauth');

function validateForm(form) {
  
  if (!form.contry || !form.city|| !form.title || !form.description || !form.main_photo || !form.price || !form.max_people) {
    return '입력칸을 모두 채워주세요.';
  }

  if(isNaN(parseInt(form.price))) {
    return '가격은 숫자로만 적어주세요.';
  }

  if(isNaN(parseInt(form.max_people))) {
    return '최대 인원은 숫자로만 적어주세요.';
  }

  if (form.description.length < 15) {
    return '설명을 15자 이상으로 써주세요.';
  }

  return null;
}

//app에 추가하기
//tour 만들기
router.get('/new',needAuth,catchErrors(async(req, res, next) =>{
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
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
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
router.get('/new/:id',needAuth,function(req,res,next){
  res.render('tour/course_new',{tour_id: req.params.id});
});

router.post('/new/:id',catchErrors(async(req, res, next) =>{
  var new_course_items = [];
  if(!req.body.title || !req.body.description|| !req.body.photo){
    req.flash('danger', '코스를 만들고 제목, 설명, 사진을 다 넣어주세요.');
    return res.redirect('back');
  }
  if(req.body.title.length <=0){
    req.flash('danger', '코스이름을 적어주세요');
    return res.redirect('back');
  }
  if(Array.isArray(req.body.title)){
    for(var i = 0; i<req.body.title.length; i++){
      var new_item = {
        title:req.body.title[i],
        require_hour: req.body.hour[i],
        require_minute: req.body.minute[i],
        description: req.body.description[i],
        photo: req.body.photo[i]}
      new_course_items.push(new_item);}
  }else{
    var new_item = {
      title:req.body.title,
      require_hour: req.body.hour,
      require_minute: req.body.minute,
      description: req.body.description,
      photo: req.body.photo}
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
  const review = await Review.find({tour:req.params.id}).populate('user');
  console.log(review);
  
  res.render('tour/show',{item:tour, reviews:review});
}));

  //----------상품 dp

router.get('/display',catchErrors(async(req, res, next) =>{
  const tours = await Tour.find({});
  console.log(tours);
    
  res.render('tour/display',{tours:tours});
  }));
  //-------수정

router.get('/edit_tour/:id',needAuth,catchErrors(async(req, res, next) =>{
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
  var err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
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
  var course = await Course.find({tour:req.params.id});
  if(course.length>0){
    res.redirect(`/tours/edit_course/${req.params.id}`);
  }
    res.redirect(`/tours/new/${req.params.id}`);
}));

router.get('/edit_course/:id',needAuth,catchErrors(async(req, res, next) =>{
  const course = await Course.findOne({tour: req.params.id});
  res.render('tour/course_edit',{coursies:course, tour_id:req.params.id});
}));

router.put('/edit_course/:id',catchErrors(async(req, res, next) =>{
  const course = await Course.findById(req.params.id);
  if(!course){
    return res.redirect(`/tours/new/${req.body.tour_id}`);
  }else{
    var edit_course_items = [];
    if(!req.body.title || !req.body.description|| !req.body.photo){
      req.flash('danger', '코스를 만들고 제목, 설명, 사진을 다 넣어주세요.');
      return res.redirect('back');
    }
    if(req.body.title.length <=0){
      req.flash('danger', '코스이름을 적어주세요');
      return res.redirect('back');
    }
    if(req.body.title.length>1){
      for(var i = 0; i<req.body.title.length; i++){
        var new_item = {
          title:req.body.title[i],
          require_hour: req.body.hour[i],
          require_minute: req.body.minute[i],
          description: req.body.description[i],
          photo: req.body.photo[i]}
        new_course_items.push(new_item);}
    }else{
      var new_item = {
        title:req.body.title,
        require_hour: req.body.hour,
        require_minute: req.body.minute,
        description: req.body.description,
        photo: req.body.photo}
        new_course_items.push(new_item);
    }
  }
  course.course_items = edit_course_items;
  await course.save();
  if(req.user.role ==='manager'){
    return res.redirect('/managers/offer');
  }
  res.redirect(`/guides/offer/list`);
}));

//삭제

router.delete('/:id',catchErrors(async(req, res, next) =>{
  await Course.findOneAndRemove({tour:req.params.id});
  await Tour.findOneAndRemove({_id:req.params.id});
  await Order.remove({tour:req.params.id});
  req.flash('success', 'Deleted Successfully.');
  res.redirect('/guides/offer/list');
}));




module.exports = router;