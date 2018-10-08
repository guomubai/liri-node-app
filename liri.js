
require("dotenv").config();



// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Put in all our requests here
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var fs = require("fs");


var keys = require('./keys');

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Setting up the Spotify search function
var spotify = new Spotify(keys.spotify);

var getArtistNames = function (artist) {
	return artist.name;
}


var searchSpotify = function (songName) {

	spotify.search({ type: 'track', query: songName }, function (err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		var songs = data.tracks.items;
		for (var i = 0; i < songs.length; i++) {
			console.log("\n-----------------------------------------------------");
			console.log(i)
			console.log("Artist(s): " + songs[i].artists.map(getArtistNames));
			console.log("Song Name: " + songs[i].name);
			console.log("Preview Song: " + songs[i].preview_url);
			console.log("Album: " + songs[i].album.name);
			console.log("-----------------------------------------------------\n");
		}
	});

}


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Setting out thye OMDB search function

var getMeMovie = function (movieName) {
	request('http://www.omdbapi.com/?t=' + movieName + '&apikey=d1e460fb', function (error, response, body) {
		if (!error && response.statusCode === 200) {

			var jsonData = JSON.parse(body);
			console.log("\n-----------------------------------------------------");
			console.log("Title: " + jsonData.Title);
			console.log("Year: " + jsonData.Year);
			console.log("Rated: " + jsonData.Rated);
			console.log("IMD Rating: " + jsonData.imdbRating);
			console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
			console.log("Country: " + jsonData.Country);
			console.log("Language: " + jsonData.Language);
			console.log("Plot: " + jsonData.Plot);
			console.log("Actors: " + jsonData.Actors);
			console.log("-----------------------------------------------------\n");
		}
	});
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// concert this function set out here

var getConcert = function (concertName) {
	var request = require('request');
	request('https://rest.bandsintown.com/artists/' + concertName + '/events?app_id=5a1dcd385402dc64f1c21015c8ff7d99', function (error, response, body) {
		if (error) {
			return console.log('Error occurred: ' + error);
		}

		var jsonData = JSON.parse(body);

		for (var i = 0; i < jsonData.length; i++) {
			console.log("\n-----------------------------------------------------");
			console.log("Venue: " + jsonData[i].venue.name)
			console.log("Location City: " + jsonData[i].venue.city)
			console.log("Location Country: " + jsonData[i].venue.country)
			var dateAndTime = moment(jsonData[i].datetime).format('lll')
			console.log("Date and Time: " + dateAndTime)

			console.log("-----------------------------------------------------\n");
		}

	});
}

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Read the txt file

var doWhatItSays = function () {
	fs.readFile("random.txt", "utf8", function (err, data) {
		if (err) throw err;
		
		var dataArray = data.split(',');
		if (dataArray.length == 2) {
			pick(dataArray[0], dataArray[1]);
		} else if (dataArray.length == 1) {
			pick(dataArray[0]);
		}

	})
}




// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// This section is for pickingf the different functions that Liri can do
var pick = function (caseData, functionData) {
	switch (caseData) {
		case "spotify-this-song":
			searchSpotify(functionData);
			break;
		case "movie-this":
			getMeMovie(functionData);
			break;
		case "concert-this":
			getConcert(functionData);
			break;
		case "do-what-it-says":
			doWhatItSays();
			break;
		default:
			console.log("Liri does not understand");




	}
}

var runThis = function (argOne, argTwo) {
	pick(argOne, argTwo)
}

var entry1 = process.argv[2];
var entry2 = process.argv.slice(3).join(" ")

runThis(entry1, entry2);


