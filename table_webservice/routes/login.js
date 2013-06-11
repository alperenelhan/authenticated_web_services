
/*
 * GET home page.
 */

exports.login = function(req, res){
	res.render('login', { user: req.user, scripts: ['javascripts/bootstrap-min.js', 'javascripts/lib.js', 'javascripts/xml2js.js', 'javascripts/select2-min.js'] });
};