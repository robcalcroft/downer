"use strict";
var downer = downer || {};

downer = {
	init: function() {
		$(document).ready(downer.watcher);
	},

	watcher: function() {
		$('input.link').change(downer.download);
	},

	download: function() {
		var iframe = document.createElement('iframe');
		var value  = $(this).val();
		var type;

		// Check that the value is a valid link
		if(!/(http||https):\/\/[a-z]+.(com)\/.+/.test(value)) {
			swal("Error", "That doesn't look like a valid link, it should look like https://SITE.TLD/EXTRA", "error");
			return;
		}

		// Get the type of the request
		if(/soundcloud/.test(value)) {
			type = "soundcloud";
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
		$('body').append(iframe)
	}
}
