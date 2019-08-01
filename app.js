const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('./src/middleware/cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
// serve static files
app.use('/', express.static(path.join(__dirname, './src/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors);

const routes = require('./src/routes/routes');

app.get('', (req, res) => {
  res.render('index');
});

require('./src/database/dbConnection');

app.use('/', routes);

// global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port ${chalk.cyan(port)}`);
});
