(function(module){

    var tool = Module("tool");
    var repo = Module("repo");

    var str_format = tool.str_format;
    var CATEGORY_OPTION = '<option value="{1}">{1}</option>';

    module.run = function(){
        $('#submit').click(submit_edit);

        for (var i = 0; i < repo.CATEGORIES.length; i++){
            var category = repo.CATEGORIES[i];
            $('#category_picker').append(str_format(CATEGORY_OPTION, category));
        }
    };

    function submit_edit(){
        var category = $('#category_picker').val();

        var card_names = $('#card_names').val().split('\n');
        var changes = [];
        for (var i = 0; i < card_names.length; i++){
            var card = repo.get_card_by_name(card_names[i]);
            var out = {};
            out.card_id = card.id;
            out.category = category;
            out.new_val = true;
            changes.push(out);
        }
        var new_data = repo.update_category(changes);
        tool.submit_data(new_data);
    }

})(Module('view_category_bulk'));
