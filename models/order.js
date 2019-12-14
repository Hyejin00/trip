var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    order:{type: Schema.Types.ObjectId, ref:'User'},
    num_people:{type:Number, required:true},
    order_date:{type:Date},
    price:{type:Number},
    tour:{type: Schema.Types.ObjectId, ref:'Tour'},
    guide:{type: Schema.Types.ObjectId, ref:'Guide'},
    createdAt: {type:Date, default:Date.now}
});

var Order = mongoose.model('Order', schema);

module.exports = Order;