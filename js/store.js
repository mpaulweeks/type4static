(function(module){

	var LINE = '<br/>';
	var CARD_FILE= 'json/data/current.json';
	module.data = {};

	function on_load(callback, data){
		module.data = data;
		var cards = data["card"];
		var status = data["status"];

    	for(var key in cards){
    		//do stuff
    	}

    	return callback();
	}

	module.load = function(callback, card_file){
		card_file = card_file || CARD_FILE;
		callback = callback || function(){};

	    var local = window.location.href.indexOf('file:///') > -1;
	    if (local){
	        card_file = 'http://mpaulweeks.github.io/type4static/' + card_file;
	    }

	    $.getJSON(card_file, function(data){
	    	on_load(callback, data);
	    });
	};

	module.get_by_name = function(name){
		var cards = module.data['card'];
		for (var i = 0; i < cards.length; i++){
			var card = cards[i];
			if (card["name"] == name){
				console.log(card);
				return card;
			}
		}
		console.log(name + " not found!")
	};
	
})(Module('store'));
