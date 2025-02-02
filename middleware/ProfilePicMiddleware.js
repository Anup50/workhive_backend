const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "profile_picture");
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    const fileName = `IMG-${Date.now()}` + ext;
    console.log(`Uploaded file name: ${fileName}`); // Debug log
    cb(null, fileName);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("File format not supported."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("profilePicture");

module.exports = upload;
