const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const Browscap = require('browscap-js');
var browscap = new Browscap();
const moment = require('moment');
const geoip = require('geoip-lite');
const countries = require('country-list')();
const randomstring = require("randomstring");

const validator = require('validator');

// Local reserved vars for db
var trackCollection, db;

// Local reserved vars for helper modules
var view, sanitize;

const trackingPixel = fs.readFileSync(path.join(__dirname, "trackpixel-inactive.gif"));
const trackingPixelRed = fs.readFileSync(path.join(__dirname, "trackpixel.gif"));

// Global config
var config = {
	port: process.env.PORT || 80,	// set our port
	rootDir: __dirname,
    //hostname: "fe373ad8.ngrok.io"
    hostname: "localhost"
};


// Makes some security changes to the headers
app.use(helmet());


// configure app
app.use(morgan('dev')); // Middleware for logging requests to the console
app.use(cookieParser()); // Parse cookies to identify track request from browser


// connect to our database
MongoClient.connect("mongodb://127.0.0.1:27017/andtracked")
    .then(function(db) {
        console.log("connected to the mongoDB !");
        trackCollection = db.collection('tracks');


        //Helper modules
        sanitize = require('./sanitize')(validator);
        view = require("./view")(config, path);

        //Serving static frontend assets
        app.use('/assets', express.static('assets'));

        // Attach the routes													// Global modules passed down to modules
        app.use('/', require('./routes/index')(config, view, express, path));
		app.use('/', require('./routes/view')(config, view, express, path, validator, sanitize, moment, countries, trackCollection));
		app.use('/track/', require('./routes/track')(config, view, express, path, validator, sanitize, browscap, geoip, randomstring, trackingPixel, trackingPixelRed, trackCollection));

        //Start the server
        var server = app.listen(config.port, function() {
            console.log('Express server listening on port ' + server.address().port);
        });

    })
    .catch(function(err) {
        console.log(err);
    });


// All global modules in sort
//config, path, fs, express, app, MongoClient, ObjectId, morgan, validator, sanitize, browscap, geoip, countries, moment, randomstring, trackingPixel, trackCollection, db
