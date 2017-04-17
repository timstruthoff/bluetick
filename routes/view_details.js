module.exports = (config, view, express, path, validator, sanitize, moment, countries, trackCollection) => {
    var router = express.Router();
    router.get('/id-:trackId/:eventId', function(req, res) {

        var errors = [];

        console.log("New view request!");

        // Checking if all parameters are present.
        if (typeof req.params.trackId !== "string" || validator.isEmpty(req.params.trackId)) {
            errors.push("Track ID missing!");
        }

        if (typeof req.params.eventId !== "string" || validator.isEmpty(req.params.eventId)) {
            errors.push("Event ID missing!");
        }

        // Returning errors early if data is missing.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }


        // Sanitizing the inputs
        var trackId = sanitize(req.params.trackId);
        var eventId = sanitize(req.params.eventId);

        // Checking for emtpy values again after the sanitizing removed all invalid characters.
        if (validator.isEmpty(trackId)) {
            errors.push("Track ID missing!");
        }
        if (validator.isEmpty(eventId)) {
            errors.push("Track ID missing!");
        }


        trackCollection.findOne({ trackId: trackId })
            .then(function(document) {

                if (document === null) {
                        console.log("Track already exists");
                        resolve();
                }
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
                res.end(view("view")(config, trackUrl, trackId, events));


            })
            .catch(function(err) {
                console.log("error", err);
                res.end("error", err);
            });



    });
    return router;
};