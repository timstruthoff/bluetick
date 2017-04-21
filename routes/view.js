module.exports = (config, view, express, path, assets, validator, sanitize, moment, countries, trackCollection) => {
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

        // Checking and sanitizing ignore cookie
        var clientMethod = 0; // Using numbers to transfer less data. 0 is "red-square"; 1 is "html".
        console.log("rawMethod:", req.cookies.method);
        if (typeof req.cookies.method === "string" && validator.isNumeric(req.cookies.method)) {
            parsedClientMethod = validator.toInt(req.cookies.method);
            if (parsedClientMethod === 1) {
                clientMethod = 1;
            }

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

                    var events = [];

                    // Looping through the array back to front
                    var arrayLength = document.events.length;
                    for (var i = arrayLength - 1; i >= 0; i--) {

                        var event = document.events[i];

                        var dateObj = moment(event.date);


                        // <Building the text>
                        var text = "Opened";

                        // If the browser was detected, append it
                        if (event.useragent.Comment !== "Default Browser") {
                            text += " with " + event.useragent.Comment;
                        }

                        // If the plattform was detected, append it
                        if (event.useragent.Platform_Description !== "unknown") {
                            text += " on " + event.useragent.Platform_Description;
                        }


                        // If the geo ip lookup was succesfull
                        if (event.geo !== null && typeof event.geo === "object" && typeof event.geo.country === "string" && !validator.isEmpty(event.geo.country)) {
                            text += " from ";

                            // If the city was detected, append it
                            if (typeof event.geo.city === "string" && !validator.isEmpty(event.geo.city)) {

                                text += event.geo.city + ", ";
                            }

                            // If there is a name for the country code append it
                            if (typeof countries.getName(event.geo.country) === "string") {
                                text += countries.getName(event.geo.country);

                            // Else use the country code
                            } else {
                                text += event.geo.country;
                            }

                        }

                        text += ".";
                        // </Building the text>



                        var newEvent = {
                            id: event.id,
                            number: i + 1,
                            timeAgo: dateObj.fromNow(),
                            text: text
                        };

                        console.log(newEvent);

                        events.push(newEvent);
                    }
                    var trackUrl = `http://${config.hostname}/track/id-${trackId}`;
                    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                    res.end(view("view")(config, assets, trackUrl, trackId, events, clientMethod));


                })
                .catch(function(err) {
                    console.log("error", err);
                    res.end("error", err);
                });

        });


    });
    return router;
};
