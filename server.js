const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // servește index.html și js/

const FILES_DIR = path.join(__dirname, 'files');

// Endpoint redenumire
app.post('/rename-file', (req, res) => {
  const { oldName, newName } = req.body;
  if (!oldName || !newName) return res.status(400).send("Lipsește oldName sau newName");

  const oldPath = path.join(FILES_DIR, oldName);
  const newPath = path.join(FILES_DIR, newName);

  fs.access(oldPath, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).send("Fișierul nu există");

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Nu s-a putut redenumi fișierul");
      }
      return res.json({ success: true, oldName, newName });
    });
  });
});

// Serve fișiere pentru download
app.use('/files', express.static(FILES_DIR));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
