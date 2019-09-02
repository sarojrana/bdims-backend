const router = require('express').Router();

const http = require('../util/httpStatus');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const addressRouter = require('./addressRoutes');
const adminRouter = require('./adminRoutes');

const authenticate = require('../middleware/authenticate');

router.get('', (req, res, next) => {
  res.status(http.OK).send({
    status: true,
    data: null,
    message: 'Welcome to blood donor facility'
  })
})

router.get('/api', (req, res, next) => {
  res.status(http.OK).send({
    status: 'API working',
    message: 'Welcome to blood donor API!'
  });
});

router.use(authRouter);

router.use('/address', addressRouter);

router.use('/users', userRouter);

router.use('/admin', authenticate, adminRouter);


module.exports = router;
