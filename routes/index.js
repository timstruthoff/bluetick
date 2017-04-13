/* jshint esversion: 6 */
module.exports = (config, view, express, path) => {
    var router = express.Router();
    router.get('/', function(req, res) {
    	res.json(req.headers['user-agent']);
        //res.end(view("index")());
    });
    return router;
};
