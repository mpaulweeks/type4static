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
        var rows = [];

        var cards = repo.get_all_cards();
        for (var ci = 0; ci < cards.length; ci++){
            var card = cards[ci];
            var img_html = str_format(EDIT_IMG_TAG, card.name, get_img_url(card));
            $('thead tr').append(img_html);

            for (var ri = 0; ri < repo.CATEGORIES.length; ri++){
                var row = rows[ri] || "";
                var category = repo.CATEGORIES[ri];
                var checked = card[category] ? 'checked' : "";
                rows[ri] = row + str_format(EDIT_ROW_TAG,
                    card.id, category, checked
                );
            }
        }

        for (var i = 0; i < repo.CATEGORIES.length; i++){
            var ROW_TEMP = '<tr><td>{1}</td>{2}</tr>';
            rows[i] = str_format(ROW_TEMP, repo.CATEGORIES[i], rows[i]);
            $('tbody').append(rows[i]);
        }

        $('.category_checkbox').click(function (){
            $(this).addClass("changed");
        });

        $('#submit').click(submit_edit);
    };

    function submit_edit(){
        var changes = [];    
        $('.changed').each(function (){
            var out = {};
            var card = $(this);
            out.card_id = card.get_attr("data-id");
            out.category = card.get_attr("data_category");
            out.new_val = card.checked;
            changes.push(card);
        });
        var new_data = repo.update_category(changes)
        tool.submit_data(new_data);
    }


})(Module('view_category'));
