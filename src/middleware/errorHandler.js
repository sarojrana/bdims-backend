const http = require('../util/httpStatus');

let errorResponse = {
  status: 'error',
  data: null,
  message: null
};

function errorHandler(err, req, res, next) {

  if(typeof (err) === 'string') {
    // custom application error
    errorResponse.message = err;
    return res.status(http.BAD_REQUEST).send(errorResponse);
  }

  if (err.name === 'ValidationError') {
       // mongoose validation error
       errorResponse.message = err.message;
       return res.status(http.BAD_REQUEST).send(errorResponse);
   }

   if (err.name === 'UnauthorizedError') {
       // jwt authentication error
       errorResponse.message = 'Unauthorized';
       return res.status(http.UNAUTHORIZED).send(errorResponse);
   }

   if(err.name === 'TokenExpiredError') {
     // jwt token expired error
     errorResponse.message = 'Token expired';
     return res.status(http.UNAUTHORIZED).send(errorResponse);
   }

   if(err.name === 'JsonWebTokenError') {
     errorResponse.message = err.message;
     if(err.message === 'jwt malformed') {
       errorResponse.message = 'Unauthorized';
     }
     return res.status(http.UNAUTHORIZED).send(errorResponse);
   }

   // default to 500 server error
   console.log('errors: ', err);
   errorResponse.message = err.message;
   return res.status(http.INTERNAL_SERVER_ERROR).send(errorResponse);
}

module.exports = errorHandler;
