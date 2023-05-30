const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

var challenges = [];
var nextChallengeIn = 0;

function loadChallenges() {
  challenges = [];
  nextChallengeIn = 0;
  fs.readdirSync(path.resolve(__dirname, '..', 'public', 'challenges')).forEach(file => {
    const challenge = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'public', 'challenges', file, 'index.json')));
    challenge.id = file;
    var temp = challenge.timestamp.split('/');
    challenge.timestamp = new Date(`${temp[1]}/${temp[0]}/${temp[2]} 12:00`).getTime();
    if (challenge.timestamp > Date.now()) {
      // don't add challenges that are not yet available and set the next challenge timer to the smallest one
      nextChallengeIn = nextChallengeIn === 0 ? challenge.timestamp : Math.min(nextChallengeIn, challenge.timestamp);
    } else {
      challenges.push(challenge);
    }
  });
}

loadChallenges();
setInterval(() => {
  loadChallenges();
// }, 1000 * 60 * 30); // reload challenges every 30 minutes
}, 1000 * 30); // DEBUG: reload challenges every 30 seconds

// is mapped to /api/challenges/
app.get('/', (req, res) => {
  res.send({
    challenges,
    nextChallengeIn
  });
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