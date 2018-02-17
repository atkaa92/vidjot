const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticaed } = require('../helpers/auth')

//load modals
require('../models/Idea');
const Idea = mongoose.model('ideas')

//routes
router.get('/add', ensureAuthenticaed, (req, res) => {
    res.render('ideas/add')
})
router.get('/', ensureAuthenticaed, (req, res) => {
    Idea.find({user:req.user.id})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
})
router.post('/', ensureAuthenticaed, (req, res) => {
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
            user: req.user.id
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea added');
                res.redirect('/ideas');
            })
    }
})
router.get('/edit/:id', ensureAuthenticaed, (req, res) => {
    Idea.findOne({ _id: req.params.id })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Not Auterized');
                res.redirect('/ideas');
            }else{
                res.render('ideas/edit', {
                    idea: idea
                })
            }
        })
})
router.put('/:id', ensureAuthenticaed, (req, res) => {
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
router.delete('/:id', ensureAuthenticaed, (req, res) => {
    Idea.remove({ _id: req.params.id, user: req.user.id })
        .then(() => {
            req.flash('success_msg', 'Video Idea removed');
            res.redirect('/ideas');
        })
});
module.exports = router;