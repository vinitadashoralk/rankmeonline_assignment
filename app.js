var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/rankmeOnlineDb";
app.get("/", (req, res) => {
	res.send("hello");
});

MongoClient.connect(url, (err, db) => {
 	if(err) throw err;
 	console.log("database connected");
 	db.close();
});

app.listen(port, () =>{
	console.log("app is listening on port" + port);
});

