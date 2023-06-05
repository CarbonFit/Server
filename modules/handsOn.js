const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

var articles = [];

function loadArticles() {
  articles = [];
  fs.readdirSync(path.resolve(__dirname, '..', 'public', 'articles')).forEach(file => {
    const articleMeta = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'public', 'articles', file, 'metadata.json')));
    articleMeta.folder = file;
    var temp = articleMeta.timestamp.split('/');
    articleMeta.timestamp = new Date(`${temp[1]}/${temp[0]}/${temp[2]} 12:00`).getTime();
    // don't add articles that are not yet available
    if (articleMeta.timestamp <= Date.now()) {
      articles.push(articleMeta);
      app.use(`/${articleMeta.id}/public`, express.static(path.resolve(__dirname, '..', 'public', 'articles', file)));
    }
  });
}

loadArticles();
setInterval(() => {
  loadArticles();
}, 1000 * 60 * 30); // reload challenges every 30 minutes
// }, 1000 * 30); // DEBUG: reload challenges every 30 seconds


// is mapped to /api/handsOn/
app.get('/', (req, res) => {
  res.send({
    articles: articles.sort((a, b) => {
      // article timestamp
      const aTimestamp = new Date(a.timestamp);
      const bTimestamp = new Date(b.timestamp);
      // sort by timestamp (newest first)
      return bTimestamp - aTimestamp;
    }).map(article => article),
  });
});

// Send the article content
app.get('/:id/index.html', (req, res) => {
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
    res.send(article);
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
    res.sendFile(path.resolve(__dirname, '..', 'public', 'articles', article.folder, article.thumb));
  } else {
    // send 404
    res.status(404).send('Path not found');
  }
});

module.exports = app;