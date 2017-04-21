/* jshint esversion: 6 */
module.exports = (config, view, express, path, randomstring) => {
    var router = express.Router();
    router.get('/', function(req, res) {
    	//res.json(req.headers['user-agent']);
    	res.redirect(302, config.protocol + '://' + config.hostname + "/id-" + randomstring.generate(6));
        //res.end(view("index")());
    });
    return router;
};
