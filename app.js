const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('database.sqlite');

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

const checkAuthentication  = (req, res, next) => {
  if(!req.session.userId) {
    return res.redirect('/login');
  }

  const userId = req.session.userId;

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if(err || !row) {
      return res.redirect('/login');
    }
    next();
  })
}

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login')(db);
const registerRouter = require('./routes/register')(db);
const todoRoute = require('./routes/todo');
const logoutRoute = require('./routes/logout');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
  )
`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/todo', checkAuthentication, todoRoute);
app.use('/logout', logoutRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
