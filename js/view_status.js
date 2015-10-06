(function(module){

    var tool = Module("tool");
    var repo = Module("repo");

    var str_format = tool.str_format;
    function get_img_url (card){
        return tool.get_img_url(repo.get_multiverse_id(card));
    }

    var STATUS_OPTION = '<option value="{1}">{2}</option>';

    module.run = function(){
        $('#submit').click(submit_edit);
        $('#datepicker').datepicker();

        for (var key in repo.STATUS_NAMES){
            $('#status_picker').append(str_format(STATUS_OPTION, key, repo.STATUS_NAMES[key]))
        }
    };

    function submit_edit(){
        var selected_date = $('#datepicker').val();
        var timestamp = selected_date ? new Date(selected_date) : tool.now();
        if (selected_date){
            timestamp.setHours(13);
        }

        var status_code = parseInt($('#status_picker').val());

        var card_names = $('#card_names').val().split('\n');

        var new_data = repo.update_status(card_names, status_code, timestamp);
        tool.submit_data(new_data);
    }


})(Module('view_status'));
