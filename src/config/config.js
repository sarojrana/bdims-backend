module.exports = {
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS) || 10,
  SECRET: process.env.SECRET || 'ttmHHlSb9mNSyU1dZjM08ocF5x3q5MVkh',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || 'AIzaSyC5h1VY3zzly6GZ4DwoXxBs50_0lljrb84',
  GRASSHOPPER_API_KEY: process.env.GRASSHOPPER_API_KEY || '169ee4a0-7120-49f1-a81b-aaa315cde5ad'
};
