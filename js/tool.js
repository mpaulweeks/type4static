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

    module.date_from_string = function(date_string){
        var a = date_string.split(/[^0-9]/);
        return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5]);
    }

    module.now = function(){
        return new Date();
    }

})(Module('tool'));
