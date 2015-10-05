var repo = Module("repo");
var autocard = Module("autocard");

(function(module){

    function str_format(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    
    function get_img_url(card){
        var card_mid = repo.get_multiverse_id(card);
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=' + card_mid;
    };

    module.str_format = str_format;
    module.get_img_url = get_img_url;

})(Module('view'));