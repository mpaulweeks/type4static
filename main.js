
DATA_PATH = 'json/data/';

function run(data_path){
    data_file = DATA_PATH + data_file

    var local = window.location.href.indexOf('file:///') > -1;
    if (local){
        data_file = 'http://mpaulweeks.github.io/type4static/' + data_file;
    }

    $.getJSON(data_file, function(json) {
        $('body').append(json);
    });
}