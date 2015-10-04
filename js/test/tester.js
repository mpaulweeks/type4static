var LINE = '<br/>';

function create_tester(name){

    var div_id = "test_" + name;
    $('body').append('<div id="' + div_id + '"></div>');

    var div_tag = "#" + div_id;
    $(div_tag).append(name + " tests begin" + LINE);

    var tester = {};

    tester.assert = function(message, value){
        $(div_tag).append(Boolean(value) + ' - ' + message + LINE);
    };

    tester.close = function(){
        $(div_tag).append(name + " tests end" + LINE);
    }

    return tester;
}