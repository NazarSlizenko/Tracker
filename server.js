
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());

// Настройка подключения к PostgreSQL (измените под свои данные)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tma_db'
});

// API Эндпоинты
app.get('/api/tasks', async (req, res) => {
  const { userId } = req.query;
  const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  res.json(result.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    userId: row.user_id,
    userName: row.user_name,
    createdAt: parseInt(row.created_at)
  })));
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, status, userId, userName } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title, description, status, user_id, user_name, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, status, userId, userName, Date.now()]
  );
  res.json(result.rows[0]);
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map((key, i) => `${key === 'userId' ? 'user_id' : key} = $${i + 1}`).join(', ');
  const values = Object.values(updates);
  const result = await pool.query(`UPDATE tasks SET ${fields} WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
  res.json(result.rows[0]);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

// Раздача статики (фронтенда)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
