var express = require('express');
var app = express();
//tell express to look in the "public" directory for any files first before send request and response
app.use(express.static("public"));app.get("/",function(req,res){
res.send("<html><body><h1>hello ,world and moreee</h1></body></html>");

});
app.listen(80);