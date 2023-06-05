var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = (db) => {
   // Retrieve the login data from the request body
  router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Perform login logic
    // Check if the provided username and password match a user in the database

    // Example: Retrieve user from 'users' table based on username and password
    db.get(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      (err, row) => {
        if(err) {
          return res.status(500).send(err.message);
        }

        if(!row) {
          // User not found or invalid credentials
          return res.status(401).send('Invalid username or password <a href="">Try again</a>');
        }

        // Set the userId in the session upon successful login
        req.session.userId = row.id;
        req.session.activeUser = row.username;

        // User found and valid credentials
        const user = encodeURIComponent(row.username)
        res.redirect('todo/?username=' + user)
      }
    )
  })
  return router;
}