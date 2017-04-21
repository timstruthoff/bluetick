module.exports = (config, view, express) => {
    var router = express.Router();
    router.get('/', function(req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.json(true);

    });
    return router;
};
