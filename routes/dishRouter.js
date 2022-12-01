const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();
const mongoose = require('mongoose')


dishRouter.use(bodyParser.json())

dishRouter.route('/')
    .get((req, res) => {
        Dishes.find({})
            .then((dishes) => {
                console.log("d", dishes);
                res.json(dishes)
            }, (err) => {
                console.log("Error ", err.message);
            }).catch(err => {
                console.log(err)
            })
    })
    .post((req, res) => {
        Dishes.create(req.body)
            .then(result => {
                console.log(result);
                res.json(result)
            })
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
        next()
    })
    .delete((req, res) => {
        Dishes.deleteMany({})
            .then((result) => {
                console.log(result);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.send(result)
            })
            .catch(err => console.log(err))
    });


dishRouter.route('/:id')
    .all((req, res, next) => {
        next();
    })
    .get((req, res) => {
        Dishes.findOne({ _id: req.params.id })
            .then(dish => {
                res.json(dish)
            })
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.send("POST operation not supported on /dishes/" + req.params.id);
    })
    .put((req, res) => {
        Dishes.updateOne({ _id: req.params.id }, {
                $set: req.body
            }, { new: true })
            .then(dish => {
                res.json(dish)
            })
    })
    .delete((req, res) => {
        Dishes.deleteOne({ _id: req.params.id })
            .then(result => {
                console.log(result);
                res.send(result)
            })
    })

module.exports = dishRouter;