const express = require('express');
const promoRouter = express.Router();
const bodyParser = require('body-parser');

promoRouter.use(bodyParser.json())

promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the promotions to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete((req, res, next) => {
        res.end('Deleting all promotions');
    });

promoRouter.route('/:id')
    .all((req, res, next) => {
        next();
    })
    .get((req, res) => {
        res.send('will send details of the promotion: ' + req.params.id + " to you");
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /promotions/" + req.params.id);
    })
    .put((req, res) => {
        res.send("update the prmotion " + req.params.id + "\nwill be update the promotion: test with details: test description");
    })
    .delete((req, res) => {
        res.send("The promotion with id " + req.params.id + " will be deleted");
    })

module.exports = promoRouter;