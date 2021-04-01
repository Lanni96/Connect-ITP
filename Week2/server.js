var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencodedBodyParser = bodyParser.urlencoded({extended:true});

app.use(urlencodedBodyParser);


app.use(express.static('public'));
var submittedData= [];

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.post('/formdata', function(req,res){
  // console.log(req.query.data);
    console.log(req.body.data);

// var dataToSave = new Object();
// dataToSave.text=req.body.data;

var dataToSave={
  text: req.body.data,
  color: req.body.color,
  date:req.body.diary
};

// console.log(dataToSave); 
submittedData.push(dataToSave);
console.log(submittedData);

var output = "<html><body>";
output += "<h1>Daily Diary </h1>";
for (var i = 0; i < submittedData.length; i++){
output += "<div style= 'color: "+ submittedData[i].color + "'>" + submittedData[i].text +"</div>";
output += "<div style= 'color: "+ submittedData[i].color + "'>" + submittedData[i].date +"</div>";

}

output += "</body></html>";
res.send(output);

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})