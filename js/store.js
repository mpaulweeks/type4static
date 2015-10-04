(function(module){

	var LINE = '<br/>';
	var CARD_FILE= 'json/data/current.json';

	module.load = function(callback, card_file){
		callback = callback || function(){};

		if(module.hasOwnProperty("data")){
			return callback();
		}

		card_file = card_file || CARD_FILE;

	    var local = window.location.href.indexOf('file:///') > -1;
	    if (local){
	        card_file = 'http://mpaulweeks.github.io/type4static/' + card_file;
	    }

	    $.getJSON(card_file, function(data){
			module.data = data;
	    	return callback();
	    });
	};
	
})(Module('store'));
