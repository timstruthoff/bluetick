/* jshint esversion: 6 */
module.exports = (config, view, express, path, fs, validator, sanitize, assetsCollection) => {
    var router = express.Router();
    router.get('/:cacheName', function(req, res) {
    	//res.json(req.headers['user-agent']);
    	var errors = [];
    	// Checking if all parameters are present.
        if (typeof req.params.cacheName !== "string" || validator.isEmpty(req.params.cacheName)) {
            errors.push("cacheName missing!");
        }


        // Returning errors early if data is missing.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }


        // Sanitizing the inputs
        var cacheName = sanitize(req.params.cacheName);

        // Checking for emtpy values again after the sanitizing removed all invalid characters.
        if (validator.isEmpty(cacheName)) {
            errors.push("cacheName missing!");
        }

        // Returning errors.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }

        
    	assetsCollection.findOne({ cacheName: cacheName })
                .then(function(document) {


                    if (document !== null) {
                        console.log("File exists");
                        

                        res.setHeader('Cache-Control', 'public, max-age=31557600');
                        //res.setHeader("Expires", new Date(Date.now() + (1000*60*60*24*365)).toUTCString());
                        res.setHeader("Content-Length", document.size);
                        res.setHeader("content-type", document.mime);
    					fs.createReadStream(document.fullPath).pipe(res);

                    } else {
                        console.log("File doesn't exist.");
                        res.status(404)        // HTTP status 404: NotFound
   							.send('Not found');
                        // Creating a new track
                        
                    }


                })
                .catch(function(err) {
                    console.log("error", err);
                    res.end("error", err);
                });
        //res.end(view("index")());
    });
    return router;
};
