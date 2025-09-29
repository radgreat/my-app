require('dotenv').config();
//const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI = 'mongodb://localhost:27017/taskdb';
const EMAIL_SECRET = process.env.EMAIL_SECRET;

const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const flash = require('connect-flash');

const path = require('path');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//Load strategy from separate config
require('./config/passport');

const taskRoutes = require('./modules/task-manager/routes/taskRoutes');
const loginRoutes = require('./modules/login/routes/loginRoutes');
const adminRoutes = require('./modules/admin/routes/adminRoutes');

const app = express();

const engine = require('ejs-mate');
app.engine('ejs', engine); // Set ejs-mate as the engine

const PORT = 3000;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        
        console.log('MongoDB Connected');
        
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    } catch (err) {
        console.error(`Can't connect mongoDB: `, err);

        setTimeout(connectDB, 1000);
    }
}

connectDB();

//set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 10 * 60 * 1000} //10mins
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.formData = req.flash('formData')[0] || {};

    res.locals.user = req.session.userId || null;
    res.locals.username = req.session.username || null;
    res.locals.role = req.session.role || null;

    // res.locals.user = {
    //     id: req.session.userId,
    //     username: req.session.username || null,
    //     role: req.session.role 
    // };

    res.locals.currentPath = req.path;
    next();
});

app.use(passport.initialize());
app.use(passport.session()); 

//routes
app.use('/tasks', taskRoutes);
app.use('/auth', loginRoutes);
app.use('/admin', adminRoutes);

//home redirect
app.get('/', (req, res) => {
    res.redirect('/auth');
});
