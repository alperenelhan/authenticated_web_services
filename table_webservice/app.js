
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , table = require('./routes/table')
  , http = require('http')
  , login = require('./routes/login')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , authantication = require('./lib/authantication')
  , flash = require('connect-flash')
  , db = require('./lib/database_ops')
  , path = require('path');

var app = express();
db.init(app);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/table', ensureAuthenticated, table.ops);
app.get('/login', login.login);

app.post('/login',
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
    res.redirect("/table");
  }
);

app.post('/table/info', ensureAuthenticated, table.getInfo);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}