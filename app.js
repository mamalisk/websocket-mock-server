const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/*
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
*/


const getApp = (configuration) => {
    const app = jsonServer.create();
    const RoutingService = require('./dist/routes/index').default;
    const indexRouter = new RoutingService(configuration).routes;
    const router = jsonServer.router('db.json')

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', indexRouter);
    app.use(router);
    return app;
}

module.exports = getApp;