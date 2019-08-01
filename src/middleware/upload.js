const multer  = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: './src/public/images',
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() +
    path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1048576 },
  fileFilter: (req, file, callback) => {
    validateFile(file, callback);
  }
}).single('image')

/**
 * file type validation
 * @param {*} file 
 * @param {*} callback 
 */
const validateFile = (file, callback ) => {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
    return callback(null, true);
  }else{
    callback("Invalid file type. Only JPEG, PNG and GIF files are allowed.")
  }
}

module.exports = upload