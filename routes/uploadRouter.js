const express = require('express');
const uploadRouter = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
const { verifyToken, verifyAdmin, verifyOrdinaryUser } =require('../controller/authenticate');

uploadRouter.use(bodyParser.json());
uploadRouter.use(express.urlencoded({extended:false}));

const storageOpt = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename : (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const fileFormatFilter = (req, file, cb) => {
    console.log("filename", file);
    if(!file.originalname){
        return cb(new Error("no file is uploaded"));
    }
    console.log(file.originalname.match(/\.(jpg|jpeg|png|gif)$/));
    if(!(file.originalname.match(/\.(jpg|jpeg|png|gif)$/))){
        return cb(new Error("Image file format must be .jpg . jpeg .gif .png"));
    }
    return cb(null, true)
}

const upload = multer({
    storage:storageOpt,
    fileFilter:fileFormatFilter,
    limits:{
        fileSize:20000
    }
})

uploadRouter.route('/')
.get(verifyToken, verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUploads');
})
.post(verifyToken, verifyAdmin, upload.single('imageFile'), (req, res) => {
   res.statusCode = 200;
   res.contentType('appliaction/json');
   res.json(req.file);
})
.put(verifyToken, verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUploads');
})
.delete(verifyToken, verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELTE operation not supported on /imageUploads');
})

module.exports = uploadRouter