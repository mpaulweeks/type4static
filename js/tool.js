var repo = Module("repo");

(function(module){

    module.str_format = function(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    
    module.get_img_url = function(card){
        var card_mid = repo.get_multiverse_id(card);
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=' + card_mid;
    };

})(Module('tool'));
