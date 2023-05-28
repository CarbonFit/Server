const express = require('express');
const path = require('path');
const app = express();
const handsOn = require('./modules/handsOn');
const challenges = require('./modules/challenges');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// sends the user the app home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home', 'index.html'));
});

app.use('/api/handsOn', handsOn);
app.use('/api/challenges', challenges);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});