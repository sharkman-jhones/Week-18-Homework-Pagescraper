var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose")
var request = require("request");
var cheerio = require("cheerio");


//Require Note and article models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

// Mongoose mpromise deprecated - use bluebird promises 
var Promise = require("bluebird");

mongoose.Promise = Promise;

var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false;
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/week18homework");
var db = mongoose.connection;

db.on("error", function(error){
	console.log("Mongoose Error: ", error);
});

db.once("open", function(){
	console.log("Mongoose connection successful.")
})

console.log("Looking for the title and thumbnail of each article")

request("https://news.google.com/news/section?cf=all&pz=1&ned=us&topic=tc&siidp=eb8b9a7de5a4857adb287af1bddd4a1a47a0&ict=ln", function(error, response, html){
	var $ = cheerio.load(html);

	var result = [];

	$("h2.esc-lead-article-title").each(function(i, element){
		var title = $(this).text();
		var link = $(element).children().attr("href");

		result.push({
			title: title,
			link: link
		});
	})

	console.log(result);
});