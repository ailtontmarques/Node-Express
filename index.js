const express = require('express');
const bodyParse = require('body-parser');

const personRoutes = require('./routes/personRoutes');

const app = express();
const port = 3000;

app.use(bodyParse.urlencoded({ extended: false }));

personRoutes(app);

app.get('/', (req, res) => res.send('Olá mundo pelo Express'));

app.listen(port, () => console.log('Api rodando na porta 3000'));
