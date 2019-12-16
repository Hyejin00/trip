var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var Tour = require('../models/tour');


/* GET home page. */

router.get('/',catchErrors(async(req, res, next) =>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {description: {'$regex': term, '$options': 'i'}},
      {contry: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const tours = await Tour.paginate(query, {
    sort: {createdAt: -1},  
    page: page, limit: limit
  });
  console.log(tours);
  
  res.render('index', {tours: tours, term: term, query: req.query});
}));

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
const uuidv4 = require('uuid/v4');

router.get('/s3', function(req,res,next){
  const s3 = new aws.S3({region:'ap-northeast-2'});
  const filename = req.query.filename;
  const type = req.query.type;
  const uuid = uuidv4();
  const params = {
    Bucket: S3_BUCKET,
    Key: uuid +'/' + filename,
    Expires:900,
    ContentType: type,
    ACL: 'public-read'
  };
  console.log(params);
  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log(err);
      return res.json({err: err});
    }
    console.log(data);
    
    res.json({
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${uuid}/${filename}`
    });
  });
})


module.exports = router;
