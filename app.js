var express = require("express");
var app = express();
var request = require("request");
var cron = require("node-cron");
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

	cron.schedule('*/1 * * * *', () =>{
		request.get("https://blog.rankmeonline.com/wp-json/wp/v2/posts", (error, response, body) =>{
			if(error){
				return console.dir(error);
			}
			var reqJsonDataObj = JSON.parse(body);
			reqJsonDataObj.forEach((reqJsonDataElement) =>{

				var JsonDataArray = {
						"date" : reqJsonDataElement.date, 
						"title" : reqJsonDataElement.title
						}; 

				rankmeOnlineDbObj.collection("rankmeOnlineDb").insert(JsonDataArray, (err, res) => {
					if(err) throw err;
					console.log("inserted");
				});
			});
	 	});
 	})
});

app.listen(port, () =>{
	console.log("app is listening on port" + port);
});

