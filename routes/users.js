var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('user/new');
});

router.post('/new',function(req,res,next){
  //회원가입 처리
  res.redirect('/');
});

module.exports = router;
