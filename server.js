// BASE SETUP

var User = require('./app/models/user');

//===============================

// CALL THE PACKAGES ------------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');



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



// connect to our DB hosted on mlabs
//mongoose.connect('config.database');
//mongoose.connect('mongodb://localhost:27017/test');
mongoose.connect('mongodb://shreyas:shreyas@ds021663.mlab.com:21663/shreyasmongo');

// set static file routes
// used for requests our front end will make
app.use (express.static('/Users/shreyas/dev/meanlearn/Full-Stack' + '/public'));






// ROUTES FOR OUR API
// ================================


// ALL OTHER ROUTES ARE BEING CALLED IN HERE
var apiRoutes = require('./app/routes/api')(app, express);




// REGISTER OUR ROUTES
// all our routes will be prefixed with /api

app.use('/api', apiRoutes);


// MAIN CATCH ALL ROUTES
// SEND USER TO FRONT END
// has to be registered after API ROUTES

app.get('*', function(req, res){
	res.sendFile(path.join('/Users/shreyas/dev/meanlearn/Full-Stack' + '/public/app/views/index.html'));
});



// Start the server
// ====================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);










