
/*
 * GET home page.
 */
var fs = require('fs');
exports.index = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
	// var j1 = fs.readFileSync('routes/eye/1.js'),
	// j2 = fs.readFileSync('routes/eye/2.js'),
	// j3 = fs.readFileSync('routes/eye/3.js');
	//res.render('eye', {j1:j1,j2:j2,j3:j3});
res.writeHead(200, {'Content-Type': 'text/html'});
res.write(fs.readFileSync('views/eye.html'));
res.end();

  //res.end();
  //res.render('eye', {});
};

exports.eyeUI = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.render('eyeUI', {});
};
