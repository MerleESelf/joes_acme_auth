const express = require('express');
const app = express();
app.use(express.json());
const { models: { User, Note } } = require('./db');
const path = require('path');

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/auth', async (req, res, next) => {
    // req.body = { username: "lucy", password: "lucy_pw" }
    try {
        res.send({ token: await User.authenticate(req.body) });
    }
    catch (ex) {
        next(ex);
    }
});

app.get('/api/auth', async (req, res, next) => {
    try {
        res.send(await User.byToken(req.headers.authorization));
    }
    catch (ex) {
        next(ex);
    }
});

// define route to get a specific user's notes 
app.get('/api/users/:id/notes', async (req, res, next) => {
    try {
        const userNotes = await User.findByPk(req.params.id, {include: Note}); 
        res.send(userNotes)
    } catch (error) {
        next(error)
    }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message });
});



module.exports = app;