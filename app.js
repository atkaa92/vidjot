const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const app = express()

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect('mongodb://127.0.0.1/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//load modals
require('./models/Idea');
const Idea = mongoose.model('ideas')

//custom middleware
app.use((req, res, next) => {
    req.naame = 'karen';
    next()
})

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

//set view engine
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//parse middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//override middleware
app.use(methodOverride('_method'));

//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.warning_msg = req.flash('warning_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.info_msg = req.flash('info_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//routes
app.get('/', (req, res) => {
    const title = 'Welcome;'
    res.render('index', {
        title: title
    })
})
app.get('/about', (req, res) => {
    res.render('about')
})

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

//listen 
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})