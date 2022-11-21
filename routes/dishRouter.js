const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
        res.end('Deleting all dishes');
    });


dishRouter.route('/:id')
    .all((req, res, next) => {
        next();
    })
    .get((req, res) => {
        res.send('will send details of the dish: ' + req.params.id + " to you");
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /dishes/" + req.params.id);
    })
    .put((req, res) => {
        res.send("update the dish " + req.params.id + "\nwill be update the dish: test with details: test description");
    })
    .delete((req, res) => {
        res.send("The dish with id " + req.params.id + " will be deleted");
    })

module.exports = dishRouter;