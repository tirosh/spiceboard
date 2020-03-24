const aws = require('aws-sdk');
const fs = require('fs');

const secrets =
    process.env.NODE_ENV == 'production'
        ? process.env // in prod the secrets are environment variables
        : require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore

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
            Bucket: 'ategev', // change to my own bucketname
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
