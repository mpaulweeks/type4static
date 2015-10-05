
(function(module){

    var LINE = '<br/>';
    var testers = 0;
    var failures = 0;

    function push_tester(){
        testers += 1;
        $('#test_main').html("RUNNING TESTS...");
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

    module.create = function(name){
        var div_id = "test_" + name;
        $('body').append('<div id="' + div_id + '"></div>');

        var div_tag = "#" + div_id;
        $(div_tag).append(LINE + name + " tests begin" + LINE);

        var tester = {};
        tester.assert = function(message, value){
            $(div_tag).append(Boolean(value) + ' - ' + message + LINE);
            if (!value){
                failures += 1;
            }
        };
        tester.close = function(){
            $(div_tag).append(name + " tests end" + LINE);
            pop_tester();
        }

        push_tester();
        return tester;
    };

})(Module("tester"));