const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const okrRoutes = require('./routes/okrRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco de dados sincronizado.");
  })
  .catch(err => {
    console.error("Erro ao sincronizar o banco de dados:", err);
  });

// Usar as rotas
app.use('/api/auth', authRoutes);
app.use('/api/okrs', okrRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});