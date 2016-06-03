// BASE SETUP

var User = require('./app/models/user');

//===============================

// CALL THE PACKAGES ------------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;


// ===============================
// DATABASE CONNECTION
// connect to our DB hosted on mlabs
mongoose.connect('mongodb://shreyas:george69@ds021663.mlab.com:21663/shreyasmongo');

//mongoose.connect('mongodb://localhost:27017/test');



//==================================
// APP CONFIGURATION ------------
// use body parser so we can gather information from POST requests

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


// configure out app to use CORS requests

app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, /Authorization');
	next();
});


// log all requests to the console

app.use(morgan('dev'));


//=========================




// ROUTES FOR OUR API
// ================================

// basic route for the home page

app.get('/', function(req,res){
res.send('Welcome to the home page');

});


// get an instance of the express router

var apiRouter = express.Router();


// middleware for all requests

apiRouter.use(function(req, res, next){
	// do logging
console.log('Somebody just came to our app!');

// we'll add more to the middleware in chapter 10

// this is where we will authenticate users

next(); // make sure we go on to the next route and dont stop here
});




//test route to make sure everything is working
// accessed at GET http://localhost:8080/api

apiRouter.get('/', function(req,res){
	res.json({ message : ' Hooray! Welcome to our API!'});

});


// more routes for API will happen here


// on routes that end in /users
//-----------------------------

apiRouter.route('/users')

// create a user accessed at POST http://localhost:8080/api/users
.post(function(req, res){

// create a new instance of the user model
var user = new User();


// set the username and other fields, comes from the request

user.name = req.body.name;
user.username = req.body.username;
user.password = req.body.password;

// save the user and check for errors

user.save(function(err) {
	if (err) {
// duplicate entry

if (err.code == 11000)
return res.json({success : false, message : 'a user with that username already exists'});
else

return res.send(err);
	}
	res.json({message : 'User created!'});

});

})



// on routes that end in /users/:user_id
// --------------------------------------

apiRouter.route('/users/:user_id')

// get the user with that id
// accessed at http://localhost:8080/api/users/:user_id

.get(function(req,res){
	User.findById(req.params.user_id, function(err, user){
	if (err) res.send(err);
	
	// return that user
	res.json(user);

});

})





apiRouter.route('/users')
// GET all the users

.get(function(req,res){
	User.find(function(err, users){
		if(err) res.send(err);

		// return the users
		res.json(users);
	});
});




// REGISTER OUR ROUTES
// all our routes will be prefixed with /api

app.use('/api', apiRouter);


// Start the server
app.listen(port);
console.log('Magic happens on port ' + port);










