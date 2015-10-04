(function(module){

	var LINE = '<br/>';
	var CARD_FILE = 'json/stack/current.json';
	var MULTIVERSE_FILE = 'json/multiverse_ids.json';
	var GITHUB_BASE = 'http://mpaulweeks.github.io/type4static/';

	module.load = function(callback, card_file){
		callback = callback || function(){};
		if(module.hasOwnProperty("data")){
			return callback();
		}

		card_file = card_file || CARD_FILE;
		multiverse_file = MULTIVERSE_FILE;

	    if (window.location.href.indexOf('file:///') > -1){
	        card_file = GITHUB_BASE + card_file;
	        multiverse_file = GITHUB_BASE + multiverse_file;
	    }

	    $.getJSON(card_file, function(data){
			module.data = data;
			$.getJSON(multiverse_file, function(ids){
				module.data.multiverse_ids = ids;
	    		return callback();
			});
	    });
	};
	
})(Module('store'));
