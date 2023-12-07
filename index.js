import express from 'express';

const port = 5000;
const app = express();

app.get('/hello', (req, res) => {
    res.send('Привет!');
});

app.listen(port, () => {
    console.log('Сервер запущен на порту', port);
});
