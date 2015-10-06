
(function(module){

    var LINE = '<br/>';
    var testers = 0;
    var failures = 0;

    function push_tester(){
        testers += 1;
        $('#test_main').html("SOMETHING BROKE");
        $('body').css('background-color', 'fuchsia');
    }

    function pop_tester(){
        testers -= 1;
        if (testers == 0){
            if(failures == 0){
                $('#test_main').html("ALL TESTS PASS");
                $('body').css('background-color', 'lightgreen');
            } else {
                $('#test_main').html("TEST FAILURES: " + failures);
                $('body').css('background-color', 'lightsalmon');
            }
        }
    }

    module.create = function(name, callback){
        var div_id = "test_" + name;
        $('body').append('<div class="test_out" id="' + div_id + '"></div>');

        var div_tag = "#" + div_id;
        $(div_tag).append(LINE + name + " tests begin" + LINE);

        var tester = {};
        tester.assert = function(message, value, data){
            $(div_tag).append('<b>' + Boolean(value) + '</b> - ' + message + LINE);
            if (!value){
                failures += 1;
                if (data){
                    $(div_tag).append('data - ' + data + LINE);
                }
            }
        };
        tester.close = function(){
            $(div_tag).append(name + " tests end" + LINE);
            pop_tester();
            if (callback){
                callback();
            }
        }

        push_tester();
        return tester;
    };

})(Module("tester"));
