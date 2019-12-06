var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    title:{type: String, required: true},
    tour:{type: Schema.Types.ObjectId, ref:'Tour'},
    require_hour:Number,
    require_minute:Number,
    description:{type: String, required: true},
    order:Number,
    photo:String
});

//상품 판매 날짜 받기. 날짜별 주문량 보여주는 페이지

var Course = mongoose.model('Course', schema);

module.exports = Course;