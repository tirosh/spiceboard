const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const s3 = require('./s3');
const db = require('./db');
const conf = require('./config');

app.use(express.json());

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static('./public'));

app.get('/image/:id', (req, res) => {
    // console.log('id: ', req.params.id);
    db.getImage(req.params.id)
        .then(result => {
            // console.log('Image from db: ', result.rows);
            res.json(result.rows);
        })
        .catch(err => {
            console.log('Error in GET /image/:id: ', err);
            res.sendStatus(500);
        });
});

app.get('/images/:lastImgId', (req, res) => {
    db.getImages(req.params.lastImgId)
        .then(dbData => dbData.rows)
        .then(imgData => {
            res.json(imgData);
        })
        .catch(err => {
            console.log('Error in GET /images/:lastImgId: ', err);
            res.sendStatus(500);
        });
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    let url = conf.s3Url + req.file.filename;
    db.addImage(req.body.title, req.body.desc, req.body.user, url)
        .then(image => {
            res.json(image.rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get('/comments/:id', (req, res) => {
    db.getComments(req.params.id)
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.log('Error in GET /comments/:id: ', err);
            res.sendStatus(500);
        });
});

app.post('/comment', (req, res) => {
    const { id, user, comment } = req.body;
    console.log('req.body :', req.body);
    db.addComment(id, user, comment)
        .then(comment => {
            res.json(comment.rows[0]);
        })
        .catch(err => {
            console.log('Error in POST /comment: ', err);
            res.sendStatus(500);
        });
});

app.use((err, req, res, next) => {
    res.status(500);
    res.render('error', { error: err });
});

if (require.main == module)
    app.listen(port, () => console.log(`I'm listening on port: ${port}`));

/*  TODO
    ---------------
    - Add "Previous" and "Next" buttons
    - Tags
    - allow users to enter the url of an image
      (make an http request to liberate the image from its host)
    - Allow to delete images
*/
