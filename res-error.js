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

function resError(config) {
	return function(req, res, next){

		// time the request
		req.start = req.start || process.hrtime();

		res.error = function error(a, b, c){
			var code, err, message;

			// find the err in the args
			if(a && typeof a != 'number')
				err = a;
			else if(b && typeof b != 'number')
				err = b;

			// find the code
			if(a && typeof a == 'number')
				code = a;
			else if(err && err.code && typeof err.code == 'number')
				code = err.code;

			// find the message
			if(c)
				message = c;
			else if(typeof err == 'string')
				message = err;
			else if(err && err.message)
				message = err.message;
			else if(code)
				message = error_codes[code];

			// fallback to defaults
			if(!code)
				code = 500;
			if(!err)
				err = error_codes[code];
			if(!message)
				message = error_codes[code];

			// coerce the message to an object
			if(typeof message == 'string')
				message = {message: message}

			// log the error
			if(config.log)
				console.error(err);

			// send the response
			res.send(code, message);
			return { code: code, message: message };
		};
		
		next();
	};
}

module.exports = function(){
	if(arguments.length === 1)
		return resError(arguments[0]);

	return resError({log: true}).apply(this, arguments);
}

