var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User' },
    name: {type: String, required:true, trim:true},
    profile:{type:String, required:true},
    kakao_id:{type:String},
    tele:{type:Number, unique: true},
    profile_photo:{type:String},
    createdAt: {type:Date, default:Date.now}
});

//프로필 사진 추가하기

var Guide = mongoose.model('Guide', schema);

module.exports = Guide;