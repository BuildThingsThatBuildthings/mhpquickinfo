const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./park_data.db');

const VALID_PARK_CODES = ['MNSHAF', 'MNRFC', 'MNWAT', 'MOGV', 'MOASH', 'MISOL'];

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS parks (
    park_code TEXT PRIMARY KEY,
    park_name TEXT,
    park_address TEXT,
    lot_rent REAL,
    water_included INTEGER DEFAULT 0,
    trash_included INTEGER DEFAULT 0,
    sewer_included INTEGER DEFAULT 0,
    electric_included INTEGER DEFAULT 0,
    manager_name TEXT,
    manager_phone TEXT,
    manager_address TEXT,
    community_email TEXT,
    office_hours TEXT,
    emergency_contact TEXT,
    notes TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.get('/api/parks', (req, res) => {
  db.all("SELECT * FROM parks ORDER BY last_updated DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

app.get('/api/park/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  
  if (!VALID_PARK_CODES.includes(code)) {
    res.status(400).json({ error: 'Invalid park code' });
    return;
  }
  
  db.get("SELECT * FROM parks WHERE park_code = ?", [code], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || { park_code: code });
  });
});

app.post('/api/park/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  
  if (!VALID_PARK_CODES.includes(code)) {
    res.status(400).json({ error: 'Invalid park code' });
    return;
  }
  
  const {
    park_name,
    park_address,
    lot_rent,
    water_included,
    trash_included,
    sewer_included,
    electric_included,
    manager_name,
    manager_phone,
    manager_address,
    community_email,
    office_hours,
    emergency_contact,
    notes
  } = req.body;

  const sql = `INSERT OR REPLACE INTO parks (
    park_code, park_name, park_address, lot_rent,
    water_included, trash_included, sewer_included, electric_included,
    manager_name, manager_phone, manager_address,
    community_email, office_hours, emergency_contact, notes, last_updated
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  db.run(sql, [
    code, park_name, park_address, lot_rent,
    water_included ? 1 : 0, trash_included ? 1 : 0, 
    sewer_included ? 1 : 0, electric_included ? 1 : 0,
    manager_name, manager_phone, manager_address,
    community_email, office_hours, emergency_contact, notes
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ park_code: code, message: 'Park information saved successfully' });
  });
});

app.get('/form/:code', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});