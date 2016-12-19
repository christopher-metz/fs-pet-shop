const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const router = express.Router();

// Read All
router.get('/pets', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      return next(err);
    }

    const pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

// Read unique
router.get('/pets/:id', (req, res, next) => {
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

// Create
router.post('/pets', (req, res, next) => {
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

router.patch('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const id = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    const age = Number.parseInt(req.body.age);
    const { kind, name } = req.body;

    if (age) {
      if (Number.isNaN(age)) {
        return res.sendStatus(400);
      }
      console.log('Hello');
      pets[id].age = age;
    }
    if (kind) {
      pets[id].kind = kind;
    }
    if (name) {
      pets[id].name = name;
    }

    const newPetJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }
      res.send(pets[id]);
    });
  });
});

router.delete('/pets/:id', (req, res, next) => {
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const id = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    const pet = pets.splice(id, 1)[0];
    const newPetJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});

router.get('/boom', (req, res, next) => {
  next(new Error('BOOM!'));
});

module.exports = router;
