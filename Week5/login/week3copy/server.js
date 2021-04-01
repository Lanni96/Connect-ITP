//express framework
var express = require('express');
var app = express(); //这个app是啥意思？
app.use(express.static('public'));
//bodyparser for POST method
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: true});//啥意思？
app.use(urlencodedBodyParser);//啥意思？
//ejs for new template
app.set('view engine', 'ejs');
//database
var datastore=require('nedb');
var db = new datastore({ filename: 'database.json', autoload:true });
// var db = new datastore({ filename: 'database.json', autoload: true });

var submittedData = [];
// var submittedData = [];

// app.get('/displayrecord', function(req,res){
//     app.find({_id: req.query._id}, function(err,docs){
//         var dataWrapper = {data: docs[0]};
//         res.render("individual.ejs", dataWrapper);
//     });
// });

app.get('/displayrecord', function (req, res) {
    db.find({_id: req.query._id}, function(err, docs) {
      var dataWrapper = {data: docs[0]};
      res.render("individual.ejs", dataWrapper);
    });
  });

  app.get('/search', function(req, res) {
    // /search?q=text to search for
    console.log("Search for: " + req.query.q);
    var query = new RegExp(req.query.q, 'i');
    db.find({text: query}, function(err, docs) {
      var dataWrapper = {data: docs};
      res.render("outputtemplate.ejs",dataWrapper);
    })
  });

app.post('/formdata', function(req,res) {
var dataToSave={
    text:req.body.data,
    color:req.body.color,
    date:req.body.date,
    longtext:req.body.longtext
};

db.insert (dataToSave, function(err, newDoc){//啥意思？这里逻辑是啥？先找，再insert?
// db.find({}, function(err,docs){
  db.find({}).sort({timestamp: 1}).exec(function(err, docs) {
    
    var dataWrapper = {data: docs};
    res.render("outputtemplate.ejs",dataWrapper);

    // var dataWrapper = {data:docs};//啥意思？为啥要给dcos命名？
    // res.render('outputtemplate.ejs', dataWrapper); //啥意思？---要把data render in a function. xxx.ejs is the function, 逗号后面的是data, 但是不可以给array of data, 要给这个function的是object of the data. dataWrapper is an object
});

});

})

app.listen(3000,function(){
    console.log('Example app listening on port 3000!');
})

