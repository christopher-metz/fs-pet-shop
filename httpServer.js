'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const petsPath = path.join(__dirname, 'pets.json');

const server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/;

  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(petsJSON);
    });
  }
  else if (req.method === 'GET' && petRegExp.test(req.url)) {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);

        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');

        return;
      }

      const pets = JSON.parse(petsJSON);
      const petIndex = req.url.match(/^\/pets\/(.*)$/)[1];

      if (!pets[petIndex]) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');

        return;
      }
      const petJSON = JSON.stringify(pets[petIndex]);

      res.setHeader('Content-Type', 'application/json');
      res.end(petJSON);
    });
  }
  else if (req.method === 'POST' && req.url === '/pets') {
    const bodyList = [];

    req.on('data', (chunk) => {
      bodyList.push(chunk);
    }).on('end', () => {
      const bodyJSON = Buffer.concat(bodyList).toString();
      const body = JSON.parse(bodyJSON);

      if (Number.isNaN(body.age) || !body.name || !body.kind || Object.keys(body).length > 3) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');

        return;
      }
      fs.readFile(petsPath, 'utf8', (readErr, data) => {
        if (readErr) {
          throw readErr;
        }
        const pets = JSON.parse(data);

        pets.push(body);
        const petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, (writeErr) => {
          if (writeErr) {
            throw writeErr;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        });
      });
    });
  }

  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
  }
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
