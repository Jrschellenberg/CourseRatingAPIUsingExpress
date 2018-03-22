const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const ReviewSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	postedOn: {
		type: Date,
		default: Date.now
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	review: {
		type: String
	}
});

ReviewSchema.methods.getUser = function(cb) {
	return User.findById(this.user, cb);
};


const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;

