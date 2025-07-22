const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uuidv4()}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed'), false);
  }
};

// Multer upload config
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

// Export helpers
module.exports = {
  single: (fieldname) => upload.single(fieldname),
  array: (fieldname, maxCount) => upload.array(fieldname, maxCount),
  fields: (fieldsArray) => upload.fields(fieldsArray)
};
