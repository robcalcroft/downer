var express = require('express');
var app     = express();
var fs      = require('fs');
var request = require('request');
var soundcloudr = require('soundcloudr');
var ydl     = require('youtube-mp3');
var port    = 8002;

app.use(express.static('src/'));

/**
 * Download the 128KBP version of the
 * requested soundcloud song
 */
app.get('/api/soundcloud/download', function(req, res) {
	soundcloudr.setClientId(fs.readFileSync('sc-api-key', 'utf8'));
	
	soundcloudr.download(req.query.url, res, function(err, done) {
		if(err) {
			res.status(err.status).json({message: err.message})
		}
	});
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
