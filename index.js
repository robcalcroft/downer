var express = require('express');
var app     = express();
var fs      = require('fs');
var request = require('request');
var apiKey  = fs.readFileSync('sc-api-key', 'utf8');
var port    = 8005;

app.use(express.static('src/'));

app.get('*', function(req, res, next) {
	if(!req.xhr) {
		res.json({
			status: 403,
			message: "API can only be accessed via XHR"
		}).status(403)
	}
})

/**
 * Download the 128KBP version of the
 * requested soundcloud song
 */
app.get('/api/soundcloud/download', function(req, res) {
	var url = req.query.url;
	var apiURL = "http://api.soundcloud.com/resolve.json?url=" + url + "&client_id=" + apiKey;
	var streamURL;

	request(apiURL, function(error, response, data) {

		data = JSON.parse(data);

		// Check to see if the result is a 
		// single song or user has provided
		// link to e.g. artist account;
		if(data.pop) {
			res.json({
				status: 403,
				message: "URL must link to a single track not an artist or other."
			}).status(403)
		}

		// Check if the song is streamable
		if(data.streamable === false) {
			res.json({
				status: 404,
				message: "Track not streamable."
			}).status(404);
			return;
		}
		
		// Set headers to force download of file.
		res.setHeader("Content-Type","application/octet-stream");
       	res.setHeader("Content-Transfer-Encoding", "Binary");
        res.setHeader("Content-disposition", "attachment; filename=\"" + data.title + ".mp3\"");

        // Create the stream URL
        streamURL = data.stream_url + "?client_id=" +apiKey;

        // Request the file and pipe it to
        // the response.
        request.get(streamURL).pipe(res);
	})
})

app.listen(process.env.port || port)