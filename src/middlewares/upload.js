import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG allowed"));
  }
};

export const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
