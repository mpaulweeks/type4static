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


    module.read_url_param = function(param_name){
        var vars = [], hash;
        var q = document.URL.split('?')[1];
        if(q != undefined){
            q = q.split('&');
            for(var i = 0; i < q.length; i++){
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        if (vars.hasOwnProperty(param_name)){
            return vars[param_name];
        }
        return null;
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
