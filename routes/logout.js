const express = require('express');
const router = express.Router();

module.exports = (req, res) => {
  // Clear the session data, including the userId

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('./login');
  })
}