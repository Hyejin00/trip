var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', function(req,res,next){
  res.render('signin');
});

router.post('/signin', function(req,res,next){
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.render('error', {message: "Error", error: err});
    } else if (!user || user.password !== req.body.password) {
      res.send('<script type="text/javascript">alert("아이디가 존재하지않거나 비밀번호가 맞지 않습니다.");</script>');
      res.redirect('back');
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  });
});

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/');
});

module.exports = router;
