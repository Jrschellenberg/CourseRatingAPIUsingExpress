const auth = require('basic-auth');
const User = require('../models/user');


export function authorizeUser(req, res, next) {
	let user = auth(req);
	if(!user || !user.name || !user.pass){
		const err = new Error("Access Denied: Please supply login credentials!");
		err.status = 401;
		return next(err);
	}
	User.authenticate(user.name, user.pass, (error, user) => {
		if(error || !user){
			const err = new Error("Access Denied: Wrong email or password");
			err.status = 401;
			return next(err);
		}
		req.session.userId = user._id;
		return next();
	});
}