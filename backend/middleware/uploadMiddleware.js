const multer = require('multer');

// Memory storage to process files directly in buffer before streaming to ImageKit
const storage = multer.memoryStorage();

// File filter validation to enforce image types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type '${file.mimetype}'. Only JPEG, JPG, PNG, and WEBP image formats are allowed.`
      ),
      false
    );
  }
};

// Configure Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size per image
    files: 10 // Max 10 images per upload batch
  }
});

// Middleware wrapper for handling Multer upload errors gracefully
const uploadPropertyImages = (req, res, next) => {
  const multerArray = upload.array('images', 10);

  multerArray(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('⚠️ Multer Upload Error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'fail',
          message: 'File size too large. Maximum allowed size per image is 5MB.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          status: 'fail',
          message: 'Too many files. Maximum allowed per property is 10 images.'
        });
      }
      return res.status(400).json({
        status: 'fail',
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.error('⚠️ File Validation Error:', err.message);
      return res.status(400).json({
        status: 'fail',
        message: err.message || 'File validation failed'
      });
    }

    next();
  });
};

module.exports = {
  uploadPropertyImages
};
