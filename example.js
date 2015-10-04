
function run(data_path){
    $.getJSON(data_path, function(json) {
        $('body').append('getJSON');
        $('body').append(json["key"]);
    });

    $.ajax({
        url: data_path,
        dataType: 'jsonp',
        success: function(json){
            $('body').append('jsonp');
            $('body').append(json["key"]);
        }
    });
}