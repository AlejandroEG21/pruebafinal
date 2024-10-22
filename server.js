import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

let articles = [];

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  socket.emit('initialArticles', articles);

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

app.post('/api/article', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Se requiere nombre y precio del artículo' });
  }

  const newArticle = { id: Date.now(), name, price };
  articles.push(newArticle);

  io.emit('newArticle', newArticle);

  res.json({ message: 'Artículo recibido y emitido', article: newArticle });
});

app.get('/api/articles', (req, res) => {
  res.json(articles);
});

app.delete('/api/articles', (req, res) => {
  articles = [];
  io.emit('clearArticles');
  res.json({ message: 'Todos los artículos han sido eliminados' });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});