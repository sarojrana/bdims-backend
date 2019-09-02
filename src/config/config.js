let config;
if(process.env.NODE_ENV === 'development') {
  config = require('./development');
} else if(process.env.NODE_ENV === 'production') {
  config = require('./production')
}

module.exports = {
  SALT_ROUNDS: config.SALT_ROUNDS,
  SECRET: config.SECRET,
  GOOGLE_API_KEY: config.GOOGLE_API_KEY,
  GRASSHOPPER_API_KEY: config.GRASSHOPPER_API_KEY,
  MONGODB_URI: config.MONGODB_URI
};
