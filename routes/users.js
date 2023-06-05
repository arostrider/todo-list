var express = require('express');
var router = express.Router();

module.exports = (db) => {
  /* GET users listing. */
  router.get('/', function(req, res) {
    db.all('SELECT * FROM users',
      [],
      (err, row) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        console.log(row);
        console.log(req.session);
        return res.render('users', {users: row, activeUser: req.session.activeUser})
      }
    )
  });
  return router;
}