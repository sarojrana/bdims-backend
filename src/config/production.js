module.exports = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
  SECRET: process.env.SECRET,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GRASSHOPPER_API_KEY: process.env.GRASSHOPPER_API_KEY,
  MONGODB_URI: process.env.MONGODB_URI,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_VERIFY_EMAIL_TEMPLATE_ID: process.env.SENDGRID_VERIFY_EMAIL_TEMPLATE_ID
};