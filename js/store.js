(function(module){

	var LINE = '<br/>';
	var CARD_FILE= 'json/data/current.json';
	module.data = {};

	module.load = function(card_file){
		card_file = card_file || CARD_FILE;

	    var local = window.location.href.indexOf('file:///') > -1;
	    if (local){
	        card_file = 'http://mpaulweeks.github.io/type4static/' + card_file;
	    }

	    $.getJSON(card_file, on_load);
	};

	function on_load(data){
		module.data = data;
		var cards = data["card"];
		var status = data["status"];

    	for(var key in cards){
    		$('body').append(cards[key]['name'] + LINE);
    	}
	}
	
})(Module('store'));
