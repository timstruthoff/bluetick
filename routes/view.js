module.exports = (config, view, express, path, validator, sanitize, moment, trackCollection) => {
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
            trackCollection.findOne({ trackId: trackId })
                .then(function(document) {

                    res.set('Content-Type', 'text/html; charset=utf-8');

                    var events = document.events.map((event) => {

                    	var newEvent = {};
                    	var dateObj = moment(event.date);


                    	newEvent.date = dateObj.fromNow();


                    	newEvent.useragent = event.useragent;

                    	return newEvent;
                    });
                    res.end(view("view")(trackId, events));


                })
                .catch(function(err) {
                    console.log("error", err);
                    res.end("error", err);
                });

        });


    });
    return router;
};
