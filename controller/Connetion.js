const { MongoClient } = require('mongodb');
const assert = require('assert');
const dishRouter = require('../routes/dishRouter');

const client = new MongoClient("mongodb://127.0.0.1:27017");

// client.connect(async (err) => {
//     if(err) console.log(err);
//     console.log("DB connected");
//     const db = client.db("conFusion");
//     const dishes = db.collection("dishes");
//     var data = [{
//         "name": "Uthappizza",
//         "image": "images/uthappizza.png",
//         "category": "mains",
//         "label": "Hot",
//         "price": "4.99"
//     }, {
//         "name": "Zucchipakoda",
//         "image": "images/zucchipakoda.png",
//         "category": "appetizer",
//         "label": "",
//         "price": "1.99"
//     }, {
//         "name": "Vadonut",
//         "image": "images/vadonut.png",
//         "category": "appetizer",
//         "label": "New",
//         "price": "1.99"
//     }]
//     var result = await dishes.insertMany(data)
// })

const op = async() => {
    // await client.connect();
    const db = await client.db('ConFusion')

    const collection = db.collection('dishes');

<<<<<<< HEAD
    var data = [{
            "name": "Uthappizza",
            "image": "images/uthappizza.png",
            "category": "mains",
            "label": "Hot",
            "price": "4.99"
        }, {
            "name": "Zucchipakoda",
            "image": "images/zucchipakoda.png",
            "category": "appetizer",
            "label": "",
            "price": "1.99"
        }, {
            "name": "Vadonut",
            "image": "images/vadonut.png",
            "category": "appetizer",
            "label": "New",
            "price": "1.99"
        }]
    let result = await collection.insertMany(data);
    console.log(result);


    // result = await collection.find({}, {
    //     sort: { "_id": 1 },
    //     projection: { name: 1, _id: 1, price: 1, label: 1 }
    // }).limit(1).skip(1).toArray()
    // await result.forEach(data => console.log(data))
    // console.log();
=======
    // var data = [{
    //     "name": "Uthappizza",
    //     "image": "images/uthappizza.png",
    //     "category": "mains",
    //     "label": "Hot",
    //     "price": "4.99"
    // }, {
    //     "name": "Zucchipakoda",
    //     "image": "images/zucchipakoda.png",
    //     "category": "appetizer",
    //     "label": "",
    //     "price": "1.99"
    // }, {
    //     "name": "Vadonut",
    //     "image": "images/vadonut.png",
    //     "category": "appetizer",
    //     "label": "New",
    //     "price": "1.99"
    // }]
    // const result = await collection.insertMany(data);
    // console.log(result);



    const result = collection.find({}, {
        sort: { "_id": 1 },
        projection: { name: 1, _id: 1, price: 1, label: 1 }
    })
    await result.forEach(data => console.log(data))
    console.log();
>>>>>>> f31e11af0a49d40fb157963b6bc5da63cbf2c35d

    // collection.insertOne({
    //     "name": "Uthappizza",
    //     "image": "images/uthappizza.png",
    //     "category": "mains",
    //     "label": "Hot",
    //     "price": "4.99",
    // }, (err, result) => {
    //     assert.equal(err, null)
    //     console.log("Data saved");
    //     console.log(result);
    // });

}

op().catch(err => console.log(err))