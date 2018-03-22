export default class Utils {
	static throwError(status, msg, next){
		const err = new Error(msg);
		err.status = status;
		return next(err);
	}
	static isError(err, next){
		if(err){
			return next(err);
		}
	}
}