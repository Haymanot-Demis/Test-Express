const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const { verifyToken,verifyAdmin,verifyOrdinaryUser } =require('../controller/authenticate');


leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        Leaders.find({})
            .then(leaders => {
                res.send(leaders)
            })
            .catch(err => {
                console.log(err.message);
            })
    })
    .post(verifyToken, verifyAdmin, (req, res, next) => {
        Leaders.create(req.body)
            .then(result => {
                res.send(result)
            })
            .catch(err => {
                console.log(err.message);
            })
    })
    .put(verifyToken, verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(verifyToken, verifyAdmin, (req, res, next) => {
        Leaders.deleteMany({})
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                console.log(err.message);
            })
    });

leaderRouter.route('/:id')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get(async(req, res) => {
        let leader = await Leaders.findById(req.params.id, 'name price');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
    })
    .post(verifyToken, verifyAdmin, (req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /promotions/" + req.params.id);
    })
    .put(verifyToken, verifyAdmin, (req, res) => {
        Leaders.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true, returnDocument: 'after' })
            .then(result => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result)
            })
            .catch(err => {
                res.statusCode = 401
                res.send(err.message)
                console.log(err);
            })
    })
    .delete(verifyToken, verifyAdmin,  (req, res) => {
        Leaders.deleteOne({ _id: req.params.id })
            .then(response => {
                res.send(response)
            })
            .catch(err => {
                res.statusCode = 401
                res.send(err.message)
                console.log(err);
            })
    })

module.exports = leaderRouter;