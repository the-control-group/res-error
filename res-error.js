var util = require('util');

var error_codes = {
	100 : 'Continue',
	101 : 'Switching Protocols',
	102 : 'Processing',
	200 : 'OK',
	201 : 'Created',
	202 : 'Accepted',
	203 : 'Non-Authoritative Information',
	204 : 'No Content',
	205 : 'Reset Content',
	206 : 'Partial Content',
	207 : 'Multi-Status',
	300 : 'Multiple Choices',
	301 : 'Moved Permanently',
	302 : 'Found',
	303 : 'See Other',
	304 : 'Not Modified',
	305 : 'Use Proxy',
	306 : 'Switch Proxy',
	307 : 'Temporary Redirect',
	400 : 'Bad Request',
	401 : 'Unauthorized',
	402 : 'Payment Required',
	403 : 'Forbidden',
	404 : 'Not Found',
	405 : 'Method Not Allowed',
	406 : 'Not Acceptable',
	407 : 'Proxy Authentication Required',
	408 : 'Request Timeout',
	409 : 'Conflict',
	410 : 'Gone',
	411 : 'Length Required',
	412 : 'Precondition Failed',
	413 : 'Request Entity Too Large',
	414 : 'Request-URI Too Long',
	415 : 'Unsupported Media Type',
	416 : 'Requested Range Not Satisfiable',
	417 : 'Expectation Failed',
	418 : 'I\'m a teapot',
	422 : 'Unprocessable Entity',
	423 : 'Locked',
	424 : 'Failed Dependency',
	425 : 'Unordered Collection',
	426 : 'Upgrade Required',
	449 : 'Retry With',
	450 : 'Blocked by Windows Parental Controls',
	500 : 'Internal Server Error',
	501 : 'Not Implemented',
	502 : 'Bad Gateway',
	503 : 'Service Unavailable',
	504 : 'Gateway Timeout',
	505 : 'HTTP Version Not Supported',
	506 : 'Variant Also Negotiates',
	507 : 'Insufficient Storage',
	509 : 'Bandwidth Limit Exceeded',
	510 : 'Not Extended'
}

function ApiError(a, b, c) {

	this.code;
	this.err;
	this.message;
	this.stack = new Error().stack;

	// find the err in the args
	if(a && typeof a != 'number')
		this.err = a;
	else if(b && typeof b != 'number')
		this.err = b;

	// find the code
	if(a && typeof a == 'number')
		this.code = a;
	else if(this.err && this.err.code && typeof this.err.code == 'number')
		this.code = this.err.code;

	// find the message
	if(c)
		this.message = c;
	else if(typeof this.err == 'string')
		this.message = this.err;
	else if(this.err && this.err.message)
		this.message = this.err.message;
	else if(this.code)
		this.message = error_codes[this.code];

	// fallback to defaults
	if(!this.code)
		this.code = 500;
	if(!this.err)
		this.err = error_codes[this.code];
	if(!this.message)
		this.message = error_codes[this.code];

	// coerce the message to an object
	if(typeof this.message == 'string')
		this.message = {message: this.message}
}

util.inherits(ApiError, Error);

function resError(config) {
	return function(req, res, next){

		// time the request
		req.start = req.start || process.hrtime();

		res.error = function error(a, b, c){
			var e;

			// build the error object
			if(a instanceof ApiError)
				e = a;
			else
				e = new ApiError(a, b, c);

			// send the response
			res.status(e.code).send(e.message);
			return e;
		};
		
		next();
	};
}

module.exports = function(){
	if(arguments.length === 1)
		return resError(arguments[0]);

	return resError({log: true}).apply(this, arguments);
}

module.exports.ApiError = ApiError;


