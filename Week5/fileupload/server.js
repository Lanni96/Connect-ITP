//express framework
// var fs=requrie ('fs');
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
// var datastore=require('nedb');
var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });

// var db = new datastore({ filename: 'database.json', autoload:true });
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

var session = require('express-session');
var nedbstore = require('nedb-session-store')(session);
var bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid');
app.use(express.static('public'));

function generateHash(password) {
	return bcrypt.hashSync(password);
}

function compareHash(password, hash) {
    return bcrypt.compareSync(password, hash);
}



var submittedData = [];

// var submittedData = [];

// app.get('/displayrecord', function(req,res){
//     app.find({_id: req.query._id}, function(err,docs){
//         var dataWrapper = {data: docs[0]};
//         res.render("individual.ejs", dataWrapper);
//     });
// });

app.use(
	session(
		{
			secret: 'secret',
			cookie: {
				 maxAge: 365 * 24 * 60 * 60 * 1000   // e.g. 1 year
				},
			store: new nedbstore({
			 filename: 'sessions.db'
			})
		}


	)
);

app.use(express.static('public'));


app.get('/displayrecord', function (req, res) {
    db.find({_id: req.query._id}, function(err, docs) {
      var dataWrapper = {data: docs[0]};
      res.render("individual.ejs", dataWrapper);
    });
  });
// //mainpage
  app.get('/', function(req, res) {
    console.log(req.session.username);
  
    if (!req.session.username) {
      res.redirect('login.html'); 
    } else {
      // Give them the main page
        //res.send('session user-id: ' + req.session.userid + '. ');
        db.find({}).sort({timestamp: 1}).exec(function(err, docs) {
    
          var dataWrapper = {data: docs};
          res.render("outputtemplate.ejs",dataWrapper);
      
          // var dataWrapper = {data:docs};//啥意思？为啥要给dcos命名？
          // res.render('outputtemplate.ejs', dataWrapper); //啥意思？---要把data render in a function. xxx.ejs is the function, 逗号后面的是data, 但是不可以给array of data, 要给这个function的是object of the data. dataWrapper is an object
      });
        // var lastlogin = req.session.lastlogin;
        // var timeelapsed = Date.now() - lastlogin;
        // timeelapsed = timeelapsed / 1000;
        // res.send("You were last here: " + Math.round(timeelapsed) + " seconds ago");
      //res.send(req.session);
      
    }
  });

  app.post('/register', function(req, res) {
    // We want to "hash" the password so that it isn't stored in clear text in the database
    var passwordHash = generateHash(req.body.password);
  
    // The information we want to store
    var registration = {
      "username": req.body.username,
      "password": passwordHash
    };
  
    // Insert into the database
    db.insert(registration);
    console.log("inserted " + registration);
    
    // Give the user an option of what to do next
    res.send("Registered Sign In" );
    
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

  app.post('/login', function(req, res) {

    // Check username and password in database
    db.findOne({"username": req.body.username},
      function(err, doc) {
        if (doc != null) {
          
          // Found user, check password				
          if (compareHash(req.body.password, doc.password)) {				
            // Set the session variable
            req.session.username = doc.username;
  
            // Put some other data in there
            req.session.lastlogin = Date.now();
  
            res.redirect('/');
            
          } else {
  
            res.send("Invalid Try again");
  
          }
        } 
      }
    );
    
  
  });		
  
  app.get('/logout', function(req, res) {
    delete req.session.username;
    res.redirect('/');
  });

app.post('/formdata', upload.single('photo'),function(req,res) {
	console.log(req.file);

var dataToSave={
    file: req.file,
    text:req.body.data,
    color:req.body.color,
    date:req.body.date,
    longtext:req.body.longtext
};


db.insert (dataToSave, function(err, newDoc){//啥意思？这里逻辑是啥？先找，再insert?
db.find({}, function(err,docs){
  // db.find({}).sort({timestamp: 1}).exec(function(err, docs) {
    
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

