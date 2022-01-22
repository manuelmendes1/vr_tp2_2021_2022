var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const fs = require('fs');

//rota user
router.get('/user', verifyUSER, (req, res) => {
    var tasks = JSON.parse(fs.readFileSync('./data/tasks.json', 'utf8'));

    res.render('user', { tasks });
});

//rota moderator
router.get('/moderator', verifyMod, (req, res, next) => {
    var logins = JSON.parse(fs.readFileSync('./data/logins.json', 'utf8'));
    res.render('mod', { logins });
});

//rota admin
router.get('/admin', verifyAdmin, (req, res, next) => {
    res.render('admin');
});

//criar task
router.post('/admin', verifyAdmin, (req, res, next) => {
    res.render('admin');
    var task = {
        user: req.body.username,
        name: req.body.task,
        todo: req.body.description,
        dueDate: req.body.date
    };

    var tasks = [];
    tasks = JSON.parse(fs.readFileSync('./data/tasks.json', 'utf8'));
    tasks.push(task);
    fs.writeFileSync('./data/tasks.json', JSON.stringify(tasks));
});

//rota logout
router.get('/logout', (req, res, next) => {
    var publicKey = fs.readFileSync('./public.key', 'utf8');
    var token = req.cookies.token;
    jwt.verify(token, publicKey, { algorithm: ["RS256"] }, function (err, decoded) {
        if (err) {
            res.cookie('token', null);
            res.redirect('http://0.0.0.0:6000');
        }
        if (decoded === undefined) {
            res.cookie('token', null);
            res.redirect('http://0.0.0.0:6000');
        }
        logins = JSON.parse(fs.readFileSync('./data/logins.json', 'utf8'));
        logins.push({ id: decoded.id, name: decoded.username, date: new Date() });
        fs.writeFileSync('./data/logins.json', JSON.stringify(logins));
    });

    res.cookie('token', null);
    res.redirect('http://0.0.0.0:6000');
});

router.all('*',verifyUSER, function (req, res, next) {
    res.redirect('/user');
});


function verifyUSER(req, res, next) {
    var token = req.cookies.token;
    if (token == null) res.redirect('http://0.0.0.0:6000');

    var publicKey = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, { algorithm: ["RS256"] }, function (err, decoded) {
        if (err) res.redirect('http://0.0.0.0:6000');
        if (decoded === undefined) res.redirect('http://0.0.0.0:6000');
        if (decoded.role !== 'user') res.redirect('/' + decoded.role);
        next();
    });
}

function verifyMod(req, res, next) {
    var token = req.cookies.token;
    if (!token) res.redirect('http://0.0.0.0:6000');

    var publicKey = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, { algorithm: ["RS256"] }, function (err, decoded) {
        if (err) res.redirect('http://0.0.0.0:6000');
        if (decoded === undefined) res.redirect('http://0.0.0.0:6000');
        if (decoded.role !== 'moderator') res.redirect('/' + decoded.role);
        next();
    });
}

function verifyAdmin(req, res, next) {
    var token = req.cookies.token;
    if (!token) return res.redirect('http://0.0.0.0:6000');

    var publicKey = fs.readFileSync('./public.key', 'utf8');
    jwt.verify(token, publicKey, { algorithm: ["RS256"] }, function (err, decoded) {
        if (err) res.redirect('http://0.0.0.0:6000');
        if (decoded === undefined) res.redirect('http://0.0.0.0:6000');
        if (decoded.role !== 'admin') res.redirect('/' + decoded.role);
        next();
    });
}

module.exports = router;
