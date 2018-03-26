module.exports = (config, view, express, path, validator, sanitize, moment, countries, trackCollection) => {
    var router = express.Router();
    router.get('/id-:trackId', function(req, res) {

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');

        var errors = [];

        console.log("New API view request!");

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

        // Returning errors.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }


        // Sanitizing the offset parameter
        var offset = 0;
        if (typeof req.query.offset === "string" && !isNaN(validator.toInt(req.query.offset)) && typeof validator.toInt(req.query.offset) === "number") {
            offset = validator.toInt(req.query.offset);
        }

        console.log("off", offset);


        console.log("id: ", trackId);
        trackCollection.findOne({ trackId: trackId })
            .then(function(document) {

                if (document === null) {
                    console.log("Track doesn't exist!");
                    res.json({ error: "Track doesn't exist!" });
                    res.end();
                    return;
                }

                var events = [];

                // Looping through the array back to front
                var arrayLength = document.events.length;
                for (var i = offset; i < arrayLength; i++) {

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
                        timeAgo: event.date,
                        text: text
                    };

                    events.push(newEvent);
                }
                var trackUrl = `${config.protocol}://${config.hostname}/track/id-${trackId}`;
                res.json({
                    trackUrl: trackUrl,
                    trackId: trackId,
                    totalLength: arrayLength,
                    offset: offset,
                    nextRequest: 1000,
                    events: events
                });


            })
            .catch(function(err) {
                console.log("error", err);
                res.json({ error: err });
            });


    });
    return router;
};
