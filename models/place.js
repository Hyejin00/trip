var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    contry:{type: String, required: true, trim:true},
    city:[String]
});

//상품 판매 날짜 받기. 날짜별 주문량 보여주는 페이지

var Place = mongoose.model('Place', schema);

module.exports = Place;