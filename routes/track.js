/* jshint esversion: 6 */
module.exports = (config, view, express, path, validator, sanitize, Browscap, trackCollection) => {
    var router = express.Router();

    

    router.get('/id-:trackId', function(req, res) {
        var trackId = req.params.trackId;
        var rawUseragent = req.headers['user-agent'];

        var browscap = new Browscap();
    	var useragent = browscap.getBrowser("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");

        res.json(useragent);
        // Checking if the track already exists
        trackCollection.findOne({ trackId: trackId })
            .then(function(document) {
                console.log("track:", trackId);
                console.log("track document:", document);

                //Async checking if track exists or needs to be created and then create
                var existsOrCreate = new Promise((resolve, reject) => {
                    if (document !== null) {
                        console.log("Track already exists");
                        resolve();
                    } else {
                        console.log("Track doesn't exist.");
                        // Creating a new track
                        trackCollection.insertOne({ trackId: trackId, events: [] })
                            .then(function(result) {

                                console.log("Track created.");
                                //res.set('Content-Type', 'text/html; charset=utf-8');
                                //res.end(view("view")(req.params.trackId));
                                resolve();
                            })
                            .catch(function(err) {
                                console.log(err);
                                res.json(["error!", err]);
                            });
                    }
                });
                console.log(req.headers['user-agent']);
                // After async check
                existsOrCreate.then(() => {
                    trackCollection.update({ trackId: trackId }, {
                                $push: {
                                    "events": {
                                        date: Date.now(),
                                        useragent: browscap.getBrowser(req.headers['user-agent'])
                                    }
                                }
                            }

                        )
                        .then(function(result) {

                            console.log("Open added.");
                            //res.set('Content-Type', 'text/html; charset=utf-8');
                            //res.end(view("view")(req.params.trackId));
                            res.end("success");
                            
                        })
                        .catch(function(err) {
                            console.log(err);
                            res.json(["error!", err]);
                        });
                    
                });

            })
            .catch(function(err) {
                console.log("error", err);
                res.end("error", err);
            });
    });
    return router;
};
