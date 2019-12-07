var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    guide:{type: Schema.Types.ObjectId, ref:'Guide'},
    place:{type: Schema.Types.ObjectId, ref:'Place'},
    title:{type: String, required: true, trim:true},
    description:{type: String, required: true},
    main_photo:{type:String},
    price:{type:Number},
    num_read:{type:Number},
    num_wishlist:{type:Number},
    max_num_people:{type:Number},
    createdAt: {type:Date, default:Date.now}
});

//상품 판매 날짜 받기. 날짜별 주문량 보여주는 페이지

var Tour = mongoose.model('Tour', schema);

module.exports = Tour;