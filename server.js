var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var Term = require('./term');
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('index');
})

var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/image_search';
mongoose.Promise = global.Promise;
mongoose.connect(url);

app.get('/api/imagesearch/:query', function (req, res) {
var query = req.params.query;
var offset = req.query.offset || 1;
var newTerm = new Term({
  term: query,
  when: new Date().toISOString()
});
newTerm.save(function(err) {
  if (err) throw err;
  console.log('User created!');
});
client.search(query, {page: offset})
    .then(images => {
      var array = [];
      images.forEach(function(image) {
      var object = { url: image.url, snippet: image.description, thumbnail: image.thumbnail.url, context: image.parentPage};
      array.push(object);
      });
      res.send(array);
    });
});

app.get('/api/latest/imagesearch/', function (req, res) {
  Term.find({}, function(err, terms) {
  if (err) throw err;
  var array = [];
  var length = 10;
  if(terms.length<10){
    length = terms.length;
  }
  for(var i=length-1; i>=0; i--){
    var object = { term: terms[i].term, when: terms[i].when };
    array.push(object);
  }
  res.send(array); 
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});

