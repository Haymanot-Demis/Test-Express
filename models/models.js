const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DishesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
});

const Dishes = mongoose.model('Dishes', DishesSchema);

Dishes.create({
    name: "Burgure"
})