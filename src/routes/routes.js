const router = require('express').Router();

const http = require('../util/httpStatus');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const addressRouter = require('./addressRoutes');
const adminRouter = require('./adminRoutes');

const authenticate = require('../middleware/authenticate');

router.get('/api', function(req, res){
  res.status(http.OK).send({
    status: 'API working',
    message: 'Welcome to site-mgmt API!'
  });
});

router.use(authRouter);

router.use('/address', addressRouter);

router.use('/users', userRouter);

router.use('/admin', authenticate, adminRouter);


module.exports = router;
