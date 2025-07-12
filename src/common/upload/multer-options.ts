import * as multer from 'multer';

export const multerOptions: multer.Options = {
  // Keep the file in memory as a buffer for processing
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // Set file size limit (2MB)
  },
  // Allow images only to be uploaded
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
};
