#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    const pets = JSON.parse(data);

    if (process.argv.length > 3) {
      const index = process.argv[3];

      if (index >= pets.length) {
        console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
        process.exit(1);
      }
      else {
        console.log(pets[index]);
      }
    }
    else {
      console.log(pets);
    }
  });
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    if (process.argv.length === 6) {
      const pets = JSON.parse(data);
      const petAge = parseInt(process.argv[3]);
      const petKind = process.argv[4];
      const petName = process.argv[5];
      const pet = { age: petAge, kind: petKind, name: petName };

      pets.push(pet);
      const petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }

        console.log(pet);
      });
    }
    else {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }
  });
}
else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    if (process.argv.length === 7) {
      const pets = JSON.parse(data);
      const petAge = parseInt(process.argv[4]);
      const petKind = process.argv[5];
      const petName = process.argv[6];
      const pet = pets[process.argv[3]];

      pet.age = petAge;
      pet.kind = petKind;
      pet.name = petName;
      const petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }

        console.log(pet);
      });
    }
    else {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      throw readErr;
    }

    if (process.argv.length === 4) {
      const pets = JSON.parse(data);
      const pet = pets[process.argv[3]];
      const beforePets = pets.slice(0, process.argv[3]);
      const afterPets = pets.slice(process.argv[3] + 1, pets.length);
      const newPets = beforePets.concat(afterPets);

      const petsJSON = JSON.stringify(newPets);

      fs.writeFile(petsPath, petsJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }

        console.log(pet);
      });
    }
    else {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
