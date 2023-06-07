const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/photo'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// ajouter filtre uniquement image type png / jpeg etc
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Seules les images sont autorisées !', false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: imageFilter
});

module.exports = upload;