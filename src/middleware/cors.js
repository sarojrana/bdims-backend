const cors = (req, res, next) => {
    const originHeaders = req.get("origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Origin", originHeaders);
  	res.header("Access-Control-Allow-Headers",
  				"Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization,token");
  	res.header("Access-Control-Allow-Credentials", "true");
  	res.header("Access-Control-Max-Age", "86400");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
        return res.status(200).send();
    }
    next();
  };
  module.exports = cors;
