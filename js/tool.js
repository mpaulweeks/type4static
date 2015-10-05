(function(module){

    module.is_local = window.location.href.indexOf('file:///') > -1;

    module.str_format = function(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    
    module.get_img_url = function(card_mid){
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=' + card_mid;
    };

})(Module('tool'));
