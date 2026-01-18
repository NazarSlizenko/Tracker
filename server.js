
import express from 'express';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const { Pool } = pkg;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Настройка пула подключений
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tma_db',
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
    console.error('Database error:', err);
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
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
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
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Раздача статики
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(__dirname, 'index.html');

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
} else {
    // Если папки dist нет (режим разработки или прямой деплой без сборщика), раздаем корень
    app.use(express.static(__dirname));
}

// FIX для Express 5: используем "/*" вместо "*" для catch-all роута
app.get('/*', (req, res) => {
  const targetFile = fs.existsSync(path.join(distPath, 'index.html')) 
    ? path.join(distPath, 'index.html') 
    : indexPath;
  res.sendFile(targetFile);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
