const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('', (req, res) => {
  res.json({routes: ['localhost:3000/mao-na-massa/materia:id', 'localhost:3000/mao-na-massa/listamaterias', 'localhost:3000/desafios']});
})

app.get('/mao-na-massa/materia:id', (req, res) => {
  const articleId = req.params.id;
  
  const data = {
    id: articleId,
    picture: 'localhost:3000/image01.jpg',
    title: 'Título da matéria',
    description: 'Descrição da matéria'
  };

  res.json(data);
});

app.get('/mao-na-massa/listamaterias', (req, res) => {
  const data = {
    materias: ['Matéria de Lavar os pés', 'Matéria de Lavar as mãos', 'Matéria de Lavar o rosto']
  }

  res.json(data);
});

app.get('/desafios', (req, res) => {
  const data = {
    challenges: ['Desafio dia 1', 'Deafio dia 2', 'Desafio dia 3']
  };

  res.json(data);
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});