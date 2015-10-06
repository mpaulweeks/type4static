(function(module){

	var tool = Module("tool");

	var LINE = '<br/>';
	var CARD_FILE = 'json/stack/current.json';
	var MULTIVERSE_FILE = 'json/multiverse_ids.json';
	var GITHUB_BASE = 'http://mpaulweeks.github.io/type4static/';

	module.load = function(callback, card_file){
		callback = callback || function(){};

		card_file = card_file || CARD_FILE;
		multiverse_file = MULTIVERSE_FILE;

	    if (tool.is_local && !tool.is_firefox){
	        card_file = GITHUB_BASE + card_file;
	        multiverse_file = GITHUB_BASE + multiverse_file;
	    }

	    $.getJSON(card_file, function(data){
			module.data = data;
			$.getJSON(multiverse_file, function(multiverse){
				module.multiverse = multiverse;
	    		return callback();
			});
	    });
	};
	
})(Module('store'));
