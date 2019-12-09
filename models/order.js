var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    order:{type: Schema.Types.ObjectId, ref:'User'},
    num_people:{type:Number, required:true},
    tour:{type: Schema.Types.ObjectId, ref:'Tour'},
    guide:{type: Schema.Types.ObjectId, ref:'Guide'},
    createdAt: {type:Date, default:Date.now}
});

var User = mongoose.model('User', schema);

module.exports = User;