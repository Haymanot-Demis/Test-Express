const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users');
const Dishes = require('./dishes');

const favouritesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:Users
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Dishes
        }
    ]
}, {
    timestamps:true
})

module.exports = mongoose.model('favourite', favouritesSchema);