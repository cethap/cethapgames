
/*
 * GET home page.
 */
var fs = require('fs');
exports.index = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");

res.writeHead(200, {'Content-Type': 'text/html'});
//res.write(fs.readFileSync('views/eye.html'));
res.write(fs.readFileSync(__dirname+"/../views/eye.html"));
res.end();

};

exports.eyeUI = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.render('eyeUI', {});
};
