import path from "path";
import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     let ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// .array("path", 12);
const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// // Check file Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Ảnh không hợp lệ !!!");
  }
}

export { uploads, uploadMultiple };
