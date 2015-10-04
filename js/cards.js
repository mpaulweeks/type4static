;

(function(module){

	var LINE = '<br/>';
	var CARD_FILE= 'json/data/current.js';
	module.cards = {};

		
	module.load = function(card_file){
		card_file = card_file || CARD_FILE;

	    var local = window.location.href.indexOf('file:///') > -1;
	    if (local){
	        card_file = 'http://mpaulweeks.github.io/type4static/' + card_file;
	    }

	    $.getJSON(card_file, on_load);
	};

	function on_load(cards){
	    	module.cards = cards;

	    	for(var key in cards){
	    		$('body').append(cards[key]['name'] + LINE);
	    	}
	}
	
})(anime.module('music'));
