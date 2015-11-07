(function(module){

    var tool = Module("tool");
    var repo = Module("repo");

    var str_format = tool.str_format;
    function get_img_url (card){
        return tool.get_img_url(repo.get_multiverse_id(card));
    }

    var EDIT_ROW_TAG = '<td class="text-center"><input class="category_checkbox" type="checkbox" data-id={1} data-category="{2}" {3}></td>';
    var EDIT_IMG_TAG = '<th><img class="cardimage" alt="{1}" src="{2}"><img/><br/>{1}</th>';
    var CAT_ROW = '<tr><td class="headcol">{1}</td>{2}</tr>';

    module.run = function(){
        var rows = [];
        var only_display_empty = tool.read_url_param("new");

        var cards = repo.get_all_cards();
        for (var ci = 0; ci < cards.length; ci++){
            var card = cards[ci];
            var true_cats = 0;
            for (var cati = 0; cati < repo.CATEGORIES.length; cati++){
                if (card[repo.CATEGORIES[cati]]){
                    true_cats += 1;
                }
            }
            if (true_cats == 0 || !only_display_empty){
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
        }

        for (var i = 0; i < repo.CATEGORIES.length - 1; i++){
            rows[i] = str_format(CAT_ROW, repo.CATEGORIES[i], rows[i]);
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
            out.card_id = card.data("id");
            out.category = card.data("category");
            out.new_val = card.is(":checked");
            changes.push(out);
        });
        var new_data = repo.update_category(changes);
        tool.submit_data(new_data);
    }


})(Module('view_category'));
