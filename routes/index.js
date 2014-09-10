var express = require('express');
var router = express.Router();

///* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});

router.get('/', function(req, res) {
    res.render('index', { imagesCount: 'images' });
});

var http = require('http');
router.post('/imagesUrl', function(req, res) {

    var params = req.body.url;
    var url = params;

    var matches;
    var urls = [];
    var rEx = /<img[^>]+src="([^">]+)/g;

    download(url, function(data) {
        if (data) {
            console.log(data);
            var str;
            str = data;
            while (matches = rEx.exec(str)) {
                urls.push(matches[1]);
            }
                console.log (urls);
                res.redirect('/');
        }
        else console.log("error");
    });
});

router.get('/downloadImages', function(req, res){

});

function download(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on('data', function (text) {
            data += text;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
}

module.exports = router;

