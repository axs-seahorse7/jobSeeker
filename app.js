var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSesson = require('express-session')
var { Server} = require('socket.io')
var http = require('http')

var indexRouter = require('./routes/index');
var usersRouter = require('./public/db/db');
var postRouter = require('./public/db/post');
var passport = require('passport');
const localStrategy = require("passport-local").Strategy

    var app = express();
    const server = http.createServer(app);
    const io = new Server(server);
const port = 4000;

app.listen(port,'0.0.0.0', ()=>{
    console.log(`app listne on port : ${port}`)
});

app.set('views', path.join(__dirname , "views"));
app.set('view engine', 'ejs');

app.use(expressSesson({
    resave:false,
    saveUninitialized:false,
    secret:"hey this is unblevible"
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(usersRouter.authenticate()));

passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/db', usersRouter);
app.use('/post', postRouter);

require('./routes/socket')(io);

module.exports = app;
