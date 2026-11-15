const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { randomBytes } = require('crypto');
const { sanitizeData } = require('./security');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
const imageExtensions = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif']
]);
const maxImageCount = 3;

fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      callback(null, `${randomBytes(16).toString('hex')}${imageExtensions.get(file.mimetype)}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: maxImageCount },
  fileFilter: (req, file, callback) => {
    if (!imageExtensions.has(file.mimetype)) {
      return callback(new Error('Upload a JPEG, PNG, WEBP, or GIF image.'));
    }
    callback(null, true);
  }
}).array('images', maxImageCount);

const removeUploadedFiles = (files = []) => {
  files.forEach((file) => {
    fs.unlink(file.path, (error) => {
      if (error && error.code !== 'ENOENT') {
        console.error('Failed to remove rejected image upload:', error);
      }
    });
  });
};

const uploadPlaceImage = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      removeUploadedFiles(req.files);
      return res.status(400).json({
        success: false,
        message: error.code === 'LIMIT_FILE_SIZE'
          ? 'Each image must be 5 MB or smaller.'
          : error.code === 'LIMIT_FILE_COUNT'
            ? `You can upload up to ${maxImageCount} images per destination.`
            : error.message
      });
    }

    if (!req.is('multipart/form-data')) {
      return next();
    }

    let placeData;
    try {
      placeData = JSON.parse(req.body.data);
    } catch (parseError) {
      removeUploadedFiles(req.files);
      return res.status(400).json({ success: false, message: 'Invalid place form data.' });
    }

    if (!placeData || typeof placeData !== 'object' || Array.isArray(placeData)) {
      removeUploadedFiles(req.files);
      return res.status(400).json({ success: false, message: 'Invalid place form data.' });
    }

    req.body = sanitizeData(placeData);
    if (req.body.images !== undefined && !Array.isArray(req.body.images)) {
      removeUploadedFiles(req.files);
      return res.status(400).json({ success: false, message: 'Images must be provided as a list.' });
    }

    const existingImages = req.body.images || [];
    if (existingImages.length + (req.files || []).length > maxImageCount) {
      removeUploadedFiles(req.files);
      return res.status(400).json({
        success: false,
        message: `You can upload up to ${maxImageCount} images per destination.`
      });
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((file) => `/uploads/${file.filename}`);
      const images = [...existingImages, ...uploadedImages];
      req.body.images = images;
      req.body.imageUrl = images[0];
      req.body.thumbnail = images[0];

      res.on('finish', () => {
        if (res.statusCode >= 400) {
          removeUploadedFiles(req.files);
        }
      });
    }

    next();
  });
};

module.exports = { uploadPlaceImage };
