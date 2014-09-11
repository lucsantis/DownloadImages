var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var request = require('request');


var matches;

/*
  GET router (renders index)
 */
router.get('/', function(req, res) {
    res.render('index', { imagesCount: 'images' });
});

// var rEx = /<img[^>]+src="([^">]+)/g;

/*
  Post router
 */
router.post('/imagesUrl', function(req, res) {

    var params = req.body.url;
    var url = params;

    var urls = [];
    var rEx = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/g;


downloadPageContent(url, function(data) {
     if (data) {
          //console.log(data);
          var str;
          var website = "www.emol.com";
          str = data;
            while (matches = rEx.exec(str)) {
                var crtUrl = matches[1];
                var count = crtUrl.match(/http/);
                if(!count){
                    crtUrl = "http://" + website + crtUrl;

                    downloadImages(crtUrl, Math.random().toString(36).substr(7) + ".jpg", function(){
                        console.log("Image downloaded!");
                    });
                }
                urls.push(crtUrl);
            }
                console.log (urls);
                urls = urls.join('\n');
                fs.writeFile('images_urls.txt', urls, function(err) {
                    if (err){
                        console.log("error");
                         }
                    else
                        res.redirect('/');
            });
        }
      else console.log("error");
    });
});

/*

 */
router.get('/downloadImages', function(req, res){
//    fs.readFile('./images_urls.txt', 'utf8', function(err, text){
//        if(err){
//            console.log("error");
//        }
//        else
//        console.log("Content read:");
//        console.log(text);
//        res.redirect('/');
//    });

//    downloadImages(, Math.random().toString(36).substr(7) + ".jpg", function(){
//        console.log("Images downloaded!");
//    });
//    res.redirect('/');
});


/*
  Download HTML content function
 */
function downloadPageContent(url, callback) {
    http.get(url, function(res) {
        var data = "";
        res.on('data', function (text) {
            data += text;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {2
        callback(null);
    });
}

/*
  Download Image function
 */
function downloadImages(url, filename, callback){
    request.head(url, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length'] );

        var path = "/images/";
        request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

module.exports = router;

