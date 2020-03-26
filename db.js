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

exports.getFocusData = id => {
    const q = `
        SELECT * FROM images
        WHERE id = $1 
        ORDER BY id DESC;`;
    return db.query(q, [id]);
};

// SIGN ADD /////////////////////////
exports.addImage = (title, description, username, url) => {
    const q = `
        INSERT INTO images (title, description, username, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
    return db.query(q, [title, description, username, url]);
};
