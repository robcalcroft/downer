var express = require('express');
var app     = express();
var fs      = require('fs');
var request = require('request');
var ydl     = require('youtube-mp3');
var apiKey  = fs.readFileSync('sc-api-key', 'utf8');
var port    = 8002;

app.use(express.static('src/'));

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
			res.status(403).json({
				status: 403,
				message: "URL must link to a single track not an artist or other."
			})
		}

		// Check if the song is streamable
		if(data.streamable === false) {
			res.status(404).json({
				status: 404,
				message: "Track not streamable."
			});
			return;
		}
		
		// Set headers to force download of file.
		res.setHeader("Content-Type","application/octet-stream");
		res.setHeader("Content-Transfer-Encoding", "Binary");
		res.setHeader("Content-disposition", "attachment; filename=\"" + data.title + ".mp3\"");

		// Create the stream URL
		if(data.stream_url.indexOf('?') === -1) {
			streamURL = data.stream_url + "?client_id=" +apiKey;
		}
		else {
			streamURL = data.stream_url + "&client_id=" +apiKey;
		}
        
		// Request the file and pipe it to
		// the response.
		request.get(streamURL).pipe(res);
	})
})

app.get('/api/youtube/download', function(req, res) {
	var url = req.query.url;

	// TODO: Wait and see if module is fixed by dev
	// https://github.com/MaxGfeller/youtube-mp3/issues/1
	return res.status(501).json({
		status: 501,
		message: "Route not implemented"
	})

	ydl.download(url, "youtube", function(err) {
		if(err) return res.status(500).json({ status: 500, message: "Error while downloading YouTube video: " + err })
	
		// Set headers to force download of file.	
		res.setHeader("Content-Type","application/octet-stream");
		res.setHeader("Content-Transfer-Encoding", "Binary");
		res.setHeader("Content-disposition", "attachment; filename=\"" + data.title + ".mp3\"");

		res.status(200).sendFile('youtube');
	})
})

app.listen(process.env.port || port)
