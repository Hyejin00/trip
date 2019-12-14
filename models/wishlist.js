var mongoose = require('mongoose'), Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    tour: {type: Schema.Types.ObjectId, ref: 'Tour'}
});

var Wishlist = mongoose.model('Wishlist', schema);

module.exports = Wishlist;