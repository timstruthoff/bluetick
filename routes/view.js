module.exports = (config, view, express, path, validator, sanitize, trackCollection) => {
    var router = express.Router();
    router.get('/id-:trackId', function(req, res) {

        var errors = [];

        console.log("New view request!");

        // Checking if all parameters are present.
        if (typeof req.params.trackId !== "string" || validator.isEmpty(req.params.trackId)) {
            errors.push("Track ID missing!");
        }

        // Returning errors early if data is missing.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }


        // Sanitizing the inputs
        var trackId = sanitize(req.params.trackId);

        // Checking for emtpy values again after the sanitizing removed all invalid characters.
        if (validator.isEmpty(trackId)) {
            errors.push("Track ID missing!");
        }

        // Checking if the track already exists
        trackCollection.findOne({ trackId: trackId })
            .then(function(document) {
                console.log("track:", trackId);
                if (document !== null) {
                    console.log("track already exists");
                    
                }

                // Inserting the data for the new user
                trackCollection.insertOne({ trackId: trackId, events: [] })
                    .then(function(result) {

                    	// Loading the track document
                        trackCollection.findOne({ trackId: trackId })
                            .then(function(document) {
                                console.log("track document:", document);
                                
                        		res.set('Content-Type', 'text/html; charset=utf-8');
                        		res.end(view("view")(trackId, JSON.stringify(document)));


                            })
                            .catch(function(err) {
                                console.log("error", err);
                                res.end("error", err);
                            });

                        

                    })
                    .catch(function(err) {
                        console.log(err);
                        res.json(["error!", err]);
                    });


            })
            .catch(function(err) {
                console.log("error", err);
                res.end("error", err);
            });


    });
    return router;
};
