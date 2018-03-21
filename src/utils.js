export default class Utils {
	constructor(){}
	static throwError(status, msg, next){
		const err = new Error(msg);
		err.status = status;
		return next(err);
	}
}