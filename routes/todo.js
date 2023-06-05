const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('database.sqlite');
// let username = '';

const getAllTasks = (req, res) => {
  db.all('SELECT * FROM tasks',
    [],
    (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.render('todo', {tasks: row, username: req.session.activeUser})
    }
  )
}

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    task TEXT
  )
`);

router.get('/', function(req, res, next) {
  const tasks = [1, 2, 3]
  getAllTasks(req, res);
});

router.post('/add', (req, res, next) => {
  const { task } = req.body;
  if (task !== '') {
    db.run(
      'INSERT INTO tasks (task) VALUES (?)',
      [task],
      function (err) {
        if (err) {
          return res.status(500).send(err.message);
        }
      },
    )
    getAllTasks(req, res);
  }
  return;
})

module.exports = router;