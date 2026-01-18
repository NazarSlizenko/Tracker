
import express from 'express';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const app = express();

// В ES-модулях нет встроенных __dirname и __filename, создаем их сами
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Настройка подключения к PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tma_db',
  // Для Render/Heroku часто требуется SSL
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// API Эндпоинты
app.get('/api/tasks', async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status, userId, userName } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, user_id, user_name, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, status, userId, userName, Date.now()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Динамическое формирование SQL запроса
    const keys = Object.keys(updates);
    if (keys.length === 0) return res.status(400).json({ error: 'No updates provided' });

    const setClause = keys
      .map((key, i) => `${key === 'userId' ? 'user_id' : key === 'userName' ? 'user_name' : key} = $${i + 1}`)
      .join(', ');
    
    const values = [...Object.values(updates), id];
    const result = await pool.query(
      `UPDATE tasks SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Раздача статики (фронтенда)
// Убедитесь, что папка сборки называется 'dist' или измените путь ниже
app.use(express.static(path.join(__dirname, 'dist')));

// Все остальные запросы направляем на index.html (для SPA роутинга)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
