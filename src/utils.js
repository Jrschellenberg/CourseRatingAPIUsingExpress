export default class Utils {
	static throwError(status, msg, next){
		const err = new Error(msg);
		err.status = status;
		return next(err);
	}
	static propagateError(err, status, next){
		err.status = status;
		return next(err);
	}
}