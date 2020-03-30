const aws = require('aws-sdk');
const fs = require('fs');

const secrets =
    process.env.NODE_ENV == 'production' ? process.env : require('./secrets');

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log('Multer did not work.');
        res.sendStatus(500);
        return;
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: 'ategev',
            ACL: 'public-read',
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        })
        .promise()
        .then(() => {
            // it worked!!!
            next();
            fs.unlink(path, () => {});
        })
        .catch(err => {
            // uh oh
            console.log(err);
            res.sendStatus(500);
        });
};
