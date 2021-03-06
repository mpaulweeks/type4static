(function(module){

	var tool = Module("tool");

	var LINE = '<br/>';
	var STACK_FILE = 'json/stack/current.json';
	var MULTIVERSE_FILE = 'json/multiverse_ids.json';
	var ALL_CARDS_FILE = 'json/AllCards.json';
	var RANKING_FILE = 'json/mail/raw.json';
	var GITHUB_BASE = 'http://mpaulweeks.github.io/type4static/';

	module.data = null;
	module.all_cards = null;
	module.ranking_raw = null;

	function fix_file(file_url){
	    if (tool.is_local && !tool.is_firefox){
	        return GITHUB_BASE + file_url;
	    }
	    return file_url;
	}

	module.load = function(callback, stack_file){
		callback = callback || function(){};

		stack_file = fix_file(stack_file || STACK_FILE);
		var multiverse_file = fix_file(MULTIVERSE_FILE);

	    $.getJSON(stack_file, function(data){
			module.data = data;
			$.getJSON(multiverse_file, function(multiverse){
				module.multiverse = multiverse;
	    		return callback();
			});
	    });
	};

	module.load_cards = function(callback, stack_file){
		var all_cards_file = fix_file(ALL_CARDS_FILE);
	    $.getJSON(all_cards_file, function(data){
	    	var lower_data = {};
	    	for (var key in data){
	    		lower_data[key.toLowerCase()] = data[key];
	    	}
			module.all_cards = lower_data;
			module.load(callback, stack_file);
	    });
	};

	module.load_ranking = function(callback, stack_file){
		var ranking_file = fix_file(RANKING_FILE);
	    $.getJSON(ranking_file, function(data){
			module.ranking_raw = data;
			module.load(callback, stack_file);
	    });
	};
	
})(Module('store'));
