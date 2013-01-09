
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.dir = function(req,res){
    console.log(req.params.id);
    res.render('dir', { dir: req.params.id });
};
