const auth = require('basic-auth');
const User = require('../models/user');
import Utils from '../utils';

export function authorizeUser(req, res, next) {
	let user = auth(req);
	if(!user || !user.name || !user.pass){
		return Utils.throwError(401, "Access Denied: Please supply login credentials!", next);
	}
	User.authenticate(user.name, user.pass, (error, user) => {
		if(error || !user){
			return Utils.throwError(401, "Access Denied: Wrong email or password", next);
		}
		req.session.userId = user._id;
		return next();
	});
}