require('dotenv').config()
require('./models/db')
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express();
const authRouter = require('./routers/auth.route')
const userRouter = require('./routers/user.route')
const auth_middleware = require("./middlewares/auth")

var whitelist = ['http://example1.com', 'http://example2.com','http://27.79.219.95:4000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


app.use(cors());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser("#\P\/^78abHgt"));

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})
app.use(express.static(path.join(__dirname, '../build')));

app.use('/api/auth', authRouter);

app.use('/api',auth_middleware.isAuth, userRouter);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, function (err) {
    if (!err) console.log("Success!")
    else console.log(err)
})