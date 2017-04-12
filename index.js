/* jshint esversion: 6 */
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev')); // Middleware for logging requests to the console

var router = express.Router();
router.get('/', function(req, res) {
    res.end("Test");
});

app.use('/', router);

var server = app.listen(3000, function() {
    console.log('Express server listening on port ' + server.address().port);
});
