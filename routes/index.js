var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET: API page */
router.get('*', function(request, response) {
    response.sendfile(path.resolve('./public/index.html'));
});

/*Live Chat feature */


module.exports = router;
