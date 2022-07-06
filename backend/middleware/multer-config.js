const multer = require("multer");

// Types of files accepted
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configure multer - creates a storage object
const storage = multer.diskStorage({
  //Setting the destination of the file (images folder)
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  //Setting the name of the file, using the original name of the file, spaces replaced by underscores + timestamp
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + Date.now() + "." + extension);
  },
});

//Exports the storage object and declaring the file type accepted
module.exports = multer({ storage }).single("image");