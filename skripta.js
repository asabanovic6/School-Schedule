var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(__dirname+"/public"));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/spirala2rasporedi.html"));
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/planiranjeNastavnik.html"));
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/podaciStudent.html"));
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/aktivnosti.html"));
});
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/test.html"));
});
app.listen(3000);