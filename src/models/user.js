const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
import isEmail from 'validator/lib/isEmail';
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	emailAddress: {
		type: Schema.Types.String,
		unique: true,
		required: true,
		trim: true,
		index: true
	},
	fullName:{
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
});
// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
	User.findOne({ emailAddress: email })
		.exec(function (error, user) {
			if (error) {
				return callback(error);
			} else if ( !user ) {
				let err = new Error('User not found.');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password , function(error, result) {
				if (result === true) {
					return callback(null, user);
				}
				return callback();
				
			})
		});
};



/*
May need some logic here later to check if email in correct format.
 */
UserSchema.statics.validEmail = function(email, callback) {
	email = email + '';
	return isEmail(email);
};


//hash password before saving to database
// hash password before saving to database
UserSchema.pre('save', function(next){ //This has to be function. for some reason. tried without and it fails..
	const user = this;
	bcrypt.hash(user.password, 10, (err, hash) => {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	})
});
const User = mongoose.model('User', UserSchema);
module.exports = User;

