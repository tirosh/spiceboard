const spicedPg = require('spiced-pg');

const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/imageboard'
);

exports.getImages = () => {
    const q = `
        SELECT * FROM images
        ORDER BY id DESC;`;
    return db.query(q);
};

// SIGN ADD /////////////////////////
exports.addImage = (title, description, username, url) => {
    const q = `
        INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4)
        RETURNING url, username, title, description`;
    return db.query(q, [title, description, username, url]);
};
