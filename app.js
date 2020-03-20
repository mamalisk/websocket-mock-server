const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const getApp = (configuration) => {
    const app = express();
    const RoutingService = require('./dist/routes/index').default;
    const indexRouter = new RoutingService(configuration).routes;
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', indexRouter);
    return app;
}

module.exports = getApp;