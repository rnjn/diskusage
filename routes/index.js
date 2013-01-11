var util = require('util');

exports.dir = function(req,res){
    console.log(util.inspect(req.query));
    res.render('dir', { dir: req.query["dir"] });
};
