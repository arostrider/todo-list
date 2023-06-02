var express = require('express');
var router = express.Router();


/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

module.exports = (db) => {
  router.post('/', (req, res) => {
    // Use the 'db' object passed from app.js to perform database operations
    const { username, password } = req.body;

    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      function (err) {
        if (err) {
          return res.status(500).send(err.message);
        }

        // User inserted successfully
        res.send('User registered');
      }
    );
  });

  return router;
};
