(function(module){

    var tool = Module("tool");
    var repo = Module("repo");

    var str_format = tool.str_format;
    function get_img_url (card){
        return tool.get_img_url(repo.get_multiverse_id(card));
    }

    var EDIT_ROW_TAG = '<td class="text-center"><input class="category_checkbox" type="checkbox" data-id={1} data-category="{2}" {3}></td>';
    var EDIT_IMG_TAG = '<th><img class="cardimage" alt="{1}" src="{2}"><img/></th>';

    module.run = function(){
        $('#submit').click(submit_edit);
    };

    function submit_edit(){
        var new_data = repo.update_status(card_names, status_code, timestamp);
        tool.submit_data(new_data);
    }


})(Module('view_status'));
