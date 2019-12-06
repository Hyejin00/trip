var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    tour: {type: Schema.Types.ObjectId, ref: 'Tour'},
    photo: {type:String},
    title:{type:String, required: true},
    description: {type:String, required: true},
    createdAt: {type:Date, default:Date.now}
});

//별점 매기기 기능

var Review = mongoose.model('Review', schema);

module.exports = Review;