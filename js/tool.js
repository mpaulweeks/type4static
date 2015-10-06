(function(module){

    module.is_local = window.location.href.indexOf('file:///') > -1;
    module.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

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
        for (var i = 0; i < 6; i++){
            a[i] = a[i] || 0;
        }
        return new Date (a[0],a[1]-1,a[2],a[3],a[4],a[5]);
    }

    module.string_from_date = function(date){
        //"2014-07-24 08:46:50.251968-07"
        var template = "{1}-{2}-{3} {4}:{5}:{6}";
        return module.str_format(template,
            date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()
        );
    }

    module.now = function(){
        return new Date();
    }

    module.submit_data = function(new_data){
        $('body').html(JSON.stringify(new_data));
    }

})(Module('tool'));
