'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

app.use(morgan('short'));

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.get('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err);
    }

    const id = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.send(pets[id]);
  });
});

app.post('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const pets = JSON.parse(petsJSON);
    const age = Number.parseInt(req.body.age);
    const name = req.body.name;
    const kind = req.body.kind;

    // const { kind, name } = req.body;

    if (Number.isNaN(age) || !kind || !name) {
      return res.sendStatus(400);
    }

    const pet = { age, kind, name };

    pets.push(pet);
    const newPetJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

app.get('/boom', (req, res, next) => {
  next(new Error('BOOM!'));
});

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
