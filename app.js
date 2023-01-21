
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');

const app = express();

var options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(morgan('dev'));
app.use(cors(options));
app.use(express.json());
app.use(config.basePath, routes);


app.listen(config.port, () => {
    console.log("Server up on port " + config.port);
});