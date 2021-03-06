/* jshint esversion: 6 */
module.exports = (config, view, express, path, validator, sanitize, browscap, geoip, randomstring, trackingPixel, trackingPixelRed, trackCollection) => {
    var router = express.Router();



    router.get('/id-:trackId', function(req, res) {
        var errors = [];

        console.log("New track request!");

        // Checking if all parameters are present.
        if (typeof req.params.trackId !== "string" || validator.isEmpty(req.params.trackId)) {
            errors.push("Track ID missing!");
        }

        if (typeof req.headers['user-agent'] !== "string" || validator.isEmpty(req.headers['user-agent'])) {
            errors.push("Useragent missing!");
        }


        // Returning errors early if data is missing.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }


        // Sanitizing the inputs
        var trackId = sanitize(req.params.trackId);
        var rawUseragent = req.headers['user-agent'];

        // Checking for emtpy values again after the sanitizing removed all invalid characters.
        if (validator.isEmpty(trackId)) {
            errors.push("Track ID missing!");
        }

        if (validator.isEmpty(rawUseragent)) {
            errors.push("Useragent missing!");
        }

        // Returning errors.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }


        // Checking and sanitizing ignore cookie
        var trackingPixelInactive = false;
        if (typeof req.cookies.trackingPixelInactive === "string" && validator.isBoolean(req.cookies.trackingPixelInactive)) {
            trackingPixelInactive = validator.toBoolean(req.cookies.trackingPixelInactive);
            if (trackingPixelInactive) {
                console.log("Open ignored!");
                res.set('Content-Type', 'image/gif');
                res.end(trackingPixelRed, "binary");
                return;
            }

        }





        console.log("track:", trackId);
        // Async checking if the track already exists or needs to be created and then create
        var existsOrCreate = new Promise((resolve, reject) => {
            trackCollection.findOne({ trackId: trackId })
                .then(function(document) {


                    if (document !== null) {
                        console.log("Track already exists");
                        resolve();
                    } else {
                        console.log("Track doesn't exist.");
                        // Creating a new track
                        trackCollection.insertOne({ trackId: trackId, events: [] })
                            .then(function(result) {

                                console.log("Track created.");
                                resolve();
                            })
                            .catch(function(err) {
                                console.log(err);
                                res.json(["error!", err]);
                            });
                    }


                })
                .catch(function(err) {
                    console.log("error", err);
                    res.end("error", err);
                });

        });

        existsOrCreate.then(() => {
            
            //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var ip = req.connection.remoteAddress;
            trackCollection.update({ trackId: trackId }, {
                        $push: {
                            "events": {
                                date: Date.now(),
                                id: randomstring.generate(6),
                                useragent: browscap.getBrowser(rawUseragent),
                                //useragent: {},
                                rawUseragent: rawUseragent,
                                ip: ip,
                                geo: geoip.lookup(ip)
                                //geo: {}
                            }
                        }
                    }

                )
                .then(function(result) {

                    res.set('Content-Type', 'image/gif');
                    res.end(trackingPixel, "binary");

                })
                .catch(function(err) {
                    console.log(err);
                    res.json(["error!", err]);
                });

        });
    });
    return router;
};
