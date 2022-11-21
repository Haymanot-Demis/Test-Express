const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser');

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all leaders');
    });


leaderRouter.route('/:id')
    .all((req, res, next) => {
        next();
    })
    .get((req, res) => {
        res.send('will send details of the leader: ' + req.params.id + " to you");
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /leaders/" + req.params.id);
    })
    .put((req, res) => {
        res.send("update the leader " + req.params.id + "\nwill be update the leader: test with details: test description");
    })
    .delete((req, res) => {
        res.send("The leader with id " + req.params.id + " will be deleted");
    })

module.exports = leaderRouter;