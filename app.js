const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express()

//connect to mongoose
mongoose.connect('mongodb://127.0.0.1/vidjot-dev')
    .then(() => console.log('MongoDB Connected...'))
    .catch(er => console.log(err)); 

//load modals
require('./models/Idea');
const Idea = mongoose.model('ideas')

//custom middleware
app.use((req, res, next) => {
    req.name = 'karen';
    next()
})

//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

//set view engine
app.set('view engine', 'handlebars');

// parse middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
})
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
})
app.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({text:'Please add a title'})
    }
    if (!req.body.details) {
        errors.push({text:'Please add some details'})
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors : errors,
            title : req.body.title,
            details : req.body.details,
        })
    }else{
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
})

//listen 
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})