var repo = Module("repo");
var view = Module("view");

(function(module){

    var EDIT_ROW_TAG = '<td class="text-center"><input class="category_checkbox" type="checkbox" data-id={1} data-category="{2}" {3}></td>';
    var EDIT_IMG_TAG = '<th><img class="cardimage" alt="{1}" src="{2}"><img/></th>';

    module.run_edit = function(){
        var rows = [];

        var cards = repo.get_all_cards();
        for (var ci = 0; ci < cards.length; ci++){
            var card = cards[ci];
            var img_html = view.str_format(EDIT_IMG_TAG, card.name, view.get_img_url(card));
            $('thead tr').append(img_html);

            for (var ri = 0; ri < repo.CATEGORIES.length; ri++){
                var row = rows[ri] || "";
                var category = repo.CATEGORIES[ri];
                var checked = card[category] ? 'checked' : "";
                rows[ri] = row + view.str_format(EDIT_ROW_TAG,
                    card.id, category, checked
                );
            }
        }

        for (var i = 0; i < repo.CATEGORIES.length; i++){
            var ROW_TEMP = '<tr><td>{1}</td>{2}</tr>';
            rows[i] = view.str_format(ROW_TEMP, repo.CATEGORIES[i], rows[i]);
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
        $('body').html(JSON.stringify(repo.get_new_json(changes)));
    }


})(Module('view_edit'));