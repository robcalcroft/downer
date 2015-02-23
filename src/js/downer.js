"use strict";
var downer = downer || {};

downer = {

	urlRegex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?.+)?$/,

	init: function() {
		$(document).ready(downer.watcher);
	},

	watcher: function() {
		$('input.link').keyup(downer.colorChanger);
		$('button.download').click(downer.download);
	},

	download: function() {
		var iframe = document.createElement('iframe');
		var value  = $('input.link').val();
		var type;

		// Check that the value is a valid link
		if(!downer.urlRegex.test(value)) {
			swal("Error", "That doesn't look like a valid link, it should look like https://example.com/things", "error");
			return;
		}

		// Get the type of the request
		if(/soundcloud./.test(value)) {
			type = "soundcloud";
		}
		else if(/youtube./.test(value)) {
			type = "youtube";
		}
		else {
			swal("Error", "I don't support that site :(", "error");
			return;
		}
		
		// URL Encode the SC URL
		value = encodeURIComponent(value);

		// Set the src to be the API route
		iframe.src = "/api/" + type + "/download?url=" + value;

		// Set the style so as to not render the iframe
		$(iframe).attr("style", "display:none;height:0;");

		// Append the iframe to the body which will call the API and start the download
		$('body').append(iframe);

		$('button.download').append("ing ...");
	},

	colorChanger: function() {
		var val = $(this).val();
		var colors = {
			"soundcloud.com": "#f70",
			"www.youtube.com": "#e52d27"
		};

		// Checks that we have a valid link
		if(!downer.urlRegex.test(val)) {
			return false;
		}

		// Change the colour to the colour of the mapped colour
		$(this).css("background-color", colors[new URL(val).hostname]);
	}
}
