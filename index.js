const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const morgan = require('morgan');
const helmet = require('helmet');

const Browscap = require('browscap-js');

const validator = require('validator');

// Local reserved vars for db
var trackCollection, db;

// Local reserved vars for helper modules
var view, sanitize;

// Global config
var config = {
	port: process.env.PORT || 4000,	// set our port
	rootDir: __dirname
};


// Makes some security changes to the headers
app.use(helmet());


// configure app
app.use(morgan('dev')); // Middleware for logging requests to the console


// connect to our database
MongoClient.connect("mongodb://127.0.0.1:27017/andtracked")
    .then(function(db) {
        console.log("connected to the mongoDB !");
        trackCollection = db.collection('tracks');


        //Helper modules
        sanitize = require('./sanitize')(validator);
        view = require("./view")(config, path);


        // Attach the routes													// Global modules passed down to modules
        app.use('/', require('./routes/index')(config, view, express, path));
		app.use('/', require('./routes/view')(config, view, express, path, validator, sanitize, trackCollection));
		app.use('/track/', require('./routes/track')(config, view, express, path, validator, sanitize, Browscap, trackCollection));

        //Start the server
        var server = app.listen(config.port, function() {
            console.log('Express server listening on port ' + server.address().port);
        });

    })
    .catch(function(err) {
        console.log(err);
    });


// All global modules in sort
//config, path, fs, express, app, MongoClient, ObjectId, morgan, validator, sanitize, Browscap, trackCollection, db
