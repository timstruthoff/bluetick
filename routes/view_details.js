module.exports = (config, view, express, path, assets, validator, sanitize, moment, countries, trackCollection) => {
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
            errors.push("Event ID missing!");
        }

        if (!isNaN(validator.toInt(eventId)) && typeof validator.toInt(eventId) === "number") {
            eventId = validator.toInt(eventId);
        } else {
            errors.push("Event ID invalid!");
        }

        // Returning errors.
        if (errors.length > 0) {
            res.json({ errors: errors });
            return;
        }
        console.log("trackId:", trackId)

        trackCollection.findOne({ trackId: trackId })
            .then(function(document) {

                if (document === null) {
                    console.log("Track doesn't exist!");
                    res.json({ error: "Track doesn't exist!" });
                    res.end();
                    return;
                }
                
                var event = document.events[eventId];

                if (!(typeof event === "object" && typeof event.date === "number")) {
                    res.json({ error: "Event doesn't exist!" });
                    res.end();
                    return;
                }

                

                var dateObj = moment.utc(event.date);
                var dateString = dateObj.format("L");
                var timeString = dateObj.format("LTS") + " UTC";

                res.set('Content-Type', 'text/html; charset=utf-8');
                res.end(view("view_details")(assets, eventId, dateString, timeString, event.useragent, event.ip, event.geo, countries)); //config, number, dateString, timeString, useragent, ip, geo

            })
            .catch(function(err) {
                console.log("error", err);
                res.end("error", err);
            });



    });
    return router;
};
