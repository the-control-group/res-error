#res-error

This package adds a super flexible `res.error()` method to express that logs an error and sends the correct JSON response to the client

##Installing

1. Run `npm install res-error --save` in your project directory
2. Apply it as middleware to your app (before the router):
	````javascript
var app = express();
app.use(require('res-error'));
...
	````
  
##Usage

The response object will now contain an `error` method which can be passed a code, message string, and/or error object.

```javascript
app.get('/path', function(res, req){

	// something happens here that might set err
	
	if(err)
		return res.error(err);
	
	return res.send('There wasn\'t an error.');
});

```

It's very flexible. Here are more examples:

```javascript
res.error(404);

res.error(err);

res.error(404, err);

res.error(404, 'Ooh, we couldn\'t find that.');

res.error(404, err, 'Ooh, we couldn\'t find that.');

res.error(404, {message: 'Ooh, we couldn\'t find that.', hidden: 'foo'});

res.error(404, {message: 'Masked message', hidden: 'foo'}, 'Ooh, we couldn\'t find that.');

res.error({code: 404, message: 'Ooh, we couldn\'t find that.', hidden: 'foo'});

```


##Oh no, I found a bug!

Please submit an issue! :)
