const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const challenges = [];

fs.readdirSync(path.resolve(__dirname, '..', 'public', 'challenges')).forEach(file => {
  const challenge = require(path.resolve(__dirname, '..', 'public', 'challenges', file, 'index.json'));
  challenge.id = file;
  challenges.push(challenge);
});

// is mapped to /api/challenges/
app.get('/', (req, res) => {
  res.send(challenges);
});

app.get('/:id/thumb', (req, res) => {
  const challenge = challenges.find(challenge => challenge.id === req.params.id);
  if (challenge) {
    // send the image
    res.sendFile(path.resolve(__dirname, '..', 'public', 'challenges', challenge.id, challenge.thumb));
  } else {
    // send 404
    res.status(404).send('Path not found');
  }
});

module.exports = app;