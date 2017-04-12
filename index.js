/* jshint esversion: 6 */
const express = require('express');
const morgan = require('morgan');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080

const app = express();
app.use(morgan('dev')); // Middleware for logging requests to the console

var router = express.Router();
router.get('/', function(req, res) {
    res.end("Test");
});

app.use('/*', router);

var server = app.listen(port, function() {
    console.log('Express server listening on port ' + server.address().port);
});
