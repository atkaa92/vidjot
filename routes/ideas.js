const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load modals
require('../models/Idea');
const Idea = mongoose.model('ideas')

//routes
router.get('/add', (req, res) => {
    res.render('ideas/add')
})
router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
})
router.post('/', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        })
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea added');
                res.redirect('/ideas');
            })
    }
})
router.get('/edit/:id', (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            })
        })
})
router.put('/:id', (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video Idea updated');
                    res.redirect('/ideas');
                })
        })
});
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video Idea removed');
            res.redirect('/ideas');
        })
});

module.exports = router;