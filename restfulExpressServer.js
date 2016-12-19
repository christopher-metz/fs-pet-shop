'use strict';

const express = require('express');

const auth = require('basic-auth');

const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

app.use(morgan('short'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const pets = require('./routes.js');

app.use((req, res, next) => {
  const credentials = auth(req);

  if (!credentials || credentials.name !== 'admin' || credentials.pass !== 'meowmix') {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('WWW-Authenticate', 'Basic realm="Required"');
    res.end('Unauthorized');
  }
  else {
    return next();
  }
});

app.use(pets);

app.use((req, res) => {
  res.sendStatus(404);
});

// eslint-disable-next-line max-params
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.send(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
