var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'us-east-1'
});

var s3 = new aws.S3();

module.exports = function(app) {

  var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "snap-spot",
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + Date.now()); 
        }
    })
  });

  app.post("/upload", upload.single('photo'), function (req, res, next) {
    res.send("Uploaded!");
    console.log(req.body);
  });

};