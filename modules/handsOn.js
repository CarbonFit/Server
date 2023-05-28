const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const articles = [];

fs.readdirSync(path.resolve(__dirname, '..', 'public', 'articles')).forEach(file => {
  const article = require(path.resolve(__dirname, '..', 'public', 'articles', file, 'metadata.json'));
  articles.push({
    id: article.id,
    content: article,
    folder: file,
  });
  app.use(`/${article.id}/public`, express.static(path.resolve(__dirname, '..', 'public', 'articles', file)));
});

// is mapped to /api/handsOn/
app.get('/', (req, res) => {
  res.send({
    articles: articles.sort((a, b) => {
      // article timestamp
      const aTimestamp = new Date(a.content.timestamp);
      const bTimestamp = new Date(b.content.timestamp);
      // sort by timestamp (newest first)
      return bTimestamp - aTimestamp;
    }).map(article => article.content),
  });
});

// Send the article content
app.get('/:id/', (req, res) => {
  const article = articles.find(article => article.id === req.params.id);
  if (article) {
    // send the article content
    res.sendFile(path.resolve(__dirname, '..', 'public', 'articles', article.folder, 'index.html'));
  } else {
    // send 404
    res.status(404).send('Path not found');
  }
});

// metadata
app.get('/:id/metadata', (req, res) => {
  const article = articles.find(article => article.id === req.params.id);
  if (article) {
    // send the article content
    res.send(article.content);
  } else {
    // send 404
    res.status(404).send('Path not found');
  }
});

// thumb
app.get('/:id/thumb', (req, res) => {
  const article = articles.find(article => article.id === req.params.id);
  if (article) {
    // send the image
    res.sendFile(path.resolve(__dirname, '..', 'public', 'articles', article.folder, article.content.thumb));
  } else {
    // send 404
    res.status(404).send('Path not found');
  }
});

module.exports = app;