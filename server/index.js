const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('CheckMe Backend работает'));
app.listen(4000, () => console.log('Сервер запущен на порту 4000'));