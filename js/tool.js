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


    module.read_url_param = function(param_name, as_list){
        as_list = as_list || false;
        var vars = {};
        var q = document.URL.split('?')[1];
        if(q != undefined){
            q = q.split('&');
            for(var i = 0; i < q.length; i++){
                var param = q[i].split('=');
                var name = param[0];
                var value = param[1];
                vars[name] = vars[name] || [];
                vars[name].push(value);
            }
        }
        if (vars.hasOwnProperty(param_name)){
            if (vars[param_name].length == 1 && !as_list){
                return vars[param_name][0];
            }
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
        $('body').empty();
        document.body.appendChild(document.createElement('pre')).innerHTML = JSON.stringify(new_data, undefined, 4);
    }

    // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    function shadeColor2(color, percent) {
        var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }
    module.shadeColor = shadeColor2;

    var NAVBAR = (
        '<nav class="navbar navbar-default navbar-static-top">' +
            '<div class="container">' +
                '<a class="navbar-brand" href="{2}">Type 4 Stack</a>' +
                '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">' +
                    '<span class="sr-only">Toggle navigation</span>' +
                    '<span class="icon-bar"></span>' +
                    '<span class="icon-bar"></span>' +
                    '<span class="icon-bar"></span>' +
                '</button>' +
                '<div class="collapse navbar-collapse navHeaderCollapse">' +
                    '<ul class="nav navbar-nav navbar-left">' +
                        '<li><a href="graph{1}">Graphs</a></li>' +
                        '<li><a href="rate{1}">Rate Cards</a></li>' +
                        '<li><a href="ranking{1}">Rankings</a></li>' +
                    '</ul></div></div></nav>'
    );
    module.load_navbar = function(){
        var suffix = module.is_local ? '.html' : '';
        var index = module.is_local ? 'index.html' : '/';
        $('.nav-parent').html(module.str_format(NAVBAR, suffix, index));
    }

})(Module('tool'));
