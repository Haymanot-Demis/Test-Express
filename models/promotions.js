const mongoose = require('mongoose');
const Schema = mongoose.Schema
// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }

})


const Promotions = mongoose.model('promotion', promotionSchema);

module.exports = Promotions