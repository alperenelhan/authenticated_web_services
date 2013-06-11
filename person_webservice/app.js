
/**
 * Module dependencies.
 */

var express = require('express')
  , people = require('./routes/people')
  , http = require('http')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , authantication = require('./lib/authantication')
  , flash = require('connect-flash')
  , db = require('./lib/database_ops')
  , path = require('path');

var app = express();
db.init(app);
// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard dog' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);

app.post('/login',
	passport.authenticate('local', { failureFlash: true }),
  function (req, res) {
    res.send({is_authanticated: true});
  }
);

app.post('/logout', function(req, res){
  req.logout();
  res.send({logout: true});
});

app.post('/people/search',
  passport.authenticate('local', {failureFlash: true}),
  people.search
);

app.post('/people/delete',
  passport.authenticate('local', {failureFlash: true}),
  people.delete
);

app.post('/people/update',
  passport.authenticate('local', {failureFlash: true}),
  people.update
);
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.send({is_authanticated: false});
// }

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}