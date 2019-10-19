var express = require('express');
var boddyParser = require('body-parser');
var mysql = require('mysql');

var app = express();
var urlencodedParser = boddyParser.urlencoded({extended: false});
var dataCore = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'DlZKtF5Twf',
    password: 'H7MxDUFLRY',
    database: 'DlZKtF5Twf'
});

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
dataCore.connect();

var profile = null;

app.get('/', function(req, res){
    profile = null;
    res.render('index', {unsc: 'False'});
});

app.post('/', urlencodedParser, function(req, res){
    dataCore.query(`SELECT * FROM users where username = '${req.body.benutzername}' AND password = '${req.body.passwort}'`, function(error, results){
        if(error){
            console.log(`Error: ${error}.`);
        }else{
            if(results.length == 0){
                res.render('index',{unsc: 'True'});
            }else{
                profile = results[0];
                dataCore.query(`SELECT * FROM results where kundennummer = '${profile.kundennummer}'`, function(error, results){
                    if(error){
                        console.log(`Error: ${error}.`);
                        console.log('FUCK YOU')
                    }else{
                        res.render('profile',{data: profile, statistic: results});
                    }
                });
            }
        }
    });
});

app.get('/registration', function(req, res){
    res.render('registration', {unsc: 'False'});
});

app.post('/registration', urlencodedParser, function(req, res){
    if (req.body.vorname === '' || req.body.nachname === '' || req.body.email === '' || req.body.benutzername === '' || req.body.passwort === ''){
        res.render('registration',{unsc: 'True'});
    }else{
        var kundennr = 0;
        if(req.body.kundennummer < 1){
            kundennr = 0;
        }else{
            kundennr = req.body.kundennummer;
        }
        dataCore.query(`INSERT INTO users (name, surname, email, username, password, kundennummer) VALUES ('${req.body.vorname}', '${req.body.nachname}', '${req.body.email}', '${req.body.benutzername}', '${req.body.passwort}', '${kundennr}')`, function(error, results){
            if(error){
                console.log(`Error: ${error}.`);
            }else{
                res.render('index', {unsc: 'False'});
            }
        });
    }
});

app.get('/profile', function(req, res){
    res.render('index', {unsc: 'False'});
});

app.listen(3000);