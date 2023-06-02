const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  const tasks = [1, 2, 3]
  const username = req.query.username;
  res.render('todo', {tasks: tasks, username: username});
});

module.exports = router;