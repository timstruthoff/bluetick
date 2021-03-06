const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const Browscap = require('browscap-js');
var browscap = new Browscap();
const moment = require('moment');
const geoip = require('geoip-lite');
const countries = require('country-list')();
const randomstring = require("randomstring");
const mime = require('mime');

const validator = require('validator');

// Local reserved vars for db
var trackCollection, assetsCollection, db;

// Local reserved vars for helper modules
var view, sanitize;

const trackingPixel = fs.readFileSync(path.join(__dirname, "trackpixel-inactive.gif"));
const trackingPixelRed = fs.readFileSync(path.join(__dirname, "trackpixel.gif"));

// Global config
var config = require("./config")(fs, __dirname);


// GZIP everything
app.use(compression());

// Makes some security changes to the headers
app.use(helmet());

// configure app
app.use(morgan('dev')); // Middleware for logging requests to the console
app.use(cookieParser()); // Parse cookies to identify track request from browser


// connect to our database
const init = () => {
    MongoClient.connect(`mongodb://${config.dbAdress}/${config.dbName}`)
        .then(function (db) {
            console.log("connected to the mongoDB !");
            trackCollection = db.collection('tracks');
            assetsCollection = db.collection('assets');


            //var getAsset = require("./getAsset")(config, path, fs, crypto, assetsCollection, mime).then((result) =>{
            //
            //            console.log("--- PROCESSASSETS END ---");
            //
            //        });

            console.log("--- PROCESSASSETS START ---");
            var assets = require("./assets")(config, path, fs, crypto, assetsCollection, mime);
            assets.loaded.then((result) => {
                console.log(assets.get("styles.css"));
                console.log("--- PROCESSASSETS END ---");

            });



            //Helper modules
            sanitize = require('./sanitize')(validator);
            view = require("./view")(config, path);

            //Serving static frontend assets
            app.use('/design', express.static('design'));
            app.use('/assets/', require('./routes/assets')(config, view, express, path, fs, validator, sanitize, assetsCollection));

            // Attach the routes                                                    // Global modules passed down to modules
            app.use('/', require('./routes/index')(config, view, express, path, randomstring));
            app.use('/', require('./routes/view')(config, view, express, path, assets, validator, sanitize, moment, countries, trackCollection));
            app.use('/', require('./routes/view_details')(config, view, express, path, assets, validator, sanitize, moment, countries, trackCollection));
            app.use('/track/', require('./routes/track')(config, view, express, path, validator, sanitize, browscap, geoip, randomstring, trackingPixel, trackingPixelRed, trackCollection));

            // API
            app.use('/api/status', require('./routes/api_status')(config, view, express));
            app.use('/api/', require('./routes/api_view')(config, view, express, path, validator, sanitize, moment, countries, trackCollection));


            const server = app.listen(config.port, function () {
                console.log('Express server listening on port ' + server.address().port);
            });
        })
        .catch(function (err) {
            console.log(err);
            setTimeout(init, 1000)
        });
}
setTimeout(init, 1000)

// All global modules in sort
//config, path, fs, express, app, MongoClient, ObjectId, morgan, validator, sanitize, browscap, geoip, countries, moment, randomstring, trackingPixel, trackCollection, db