var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/rankmeOnlineDb";

MongoClient.connect(url, (err, db) => {
 	if(err) throw err;
 	var rankmeOnlineDbObj = db.db("rankmeOnlineDb");
 	var sortdata = {$natural: -1};
 	console.log("database connected");
 	app.get("/", (req, res) => {
		
		rankmeOnlineDbObj.collection("rankmeOnlineDb").find({}).limit(2).sort(sortdata).toArray((err, lastRecord) => {
			if(err) throw err;
			res.send(lastRecord);
		});

	});
});

app.listen(port, () =>{
	console.log("app is listening on port" + port);
});

