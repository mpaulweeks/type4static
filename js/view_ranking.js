(function(module){

    var tool = Module("tool");
    var store = Module("store");
    var repo = Module("repo");
    var ranking = Module("ranking");
    var autocard = Module("autocard");
    var view_index = Module("view_index");

    var NOW = tool.now();

    var CATEGORY_HTML = '<button id="category-{1}">{1}</button>';
    var CARD_HTML = '<div class="ranking-status-{1}"> {2} - {3} </div>';

    var request = {};
    request.categories = [];

    function all_relevant_cards(){
        var current = repo.get_by_date_and_status(NOW, repo.IN_STACK);
        var future = repo.get_by_date_and_status(NOW, repo.GOING_IN_STACK);
        return current.concat(future);
    }

    function apply_filters(cards){
        var categories = request.categories;
        if (categories.length > 0){
            cards = repo.filter_cards_by_categories(cards, categories);
        }
        return cards;
    }

    function apply_scores(cards, scoreboard){
        cards.forEach(function (card){
            card.score = scoreboard.get(card.name).score;
        });
    }

    function sort_cards(cards){
        cards.sort(function (a,b){
            if (a.score > b.score){ return -1; }
            if (a.score < b.score){ return 1; }
            return 0;
        });
    }

    function display_ranking(){
        var scoreboard = ranking.process_ratings(store.ranking_raw);
        var cards = all_relevant_cards();

        cards = apply_filters(cards);

        apply_scores(cards, scoreboard);
        sort_cards(cards);

        var descend_html = "";
        var ascend_html = "";
        cards.forEach(function (card){
            var status = repo.get_status_code(card, NOW);
            var name = view_index.get_text_tag(card);
            var card_html = tool.str_format(CARD_HTML, status, card.score, name);
            descend_html = descend_html + card_html;
            ascend_html = card_html + ascend_html;
        });
        $("#rankings-ascend").html(ascend_html);
        $("#rankings-descend").html(descend_html);
        autocard.init();
    }

    module.run = function(){
        tool.load_navbar();

        repo.CATEGORIES.forEach(function (cat){
            var html = tool.str_format(CATEGORY_HTML, cat);
            $('#categories').append(html);
            $('#category-' + cat).click(function (){
                request.categories = [cat];
                display_ranking();
            });
        });

        display_ranking();
    };

})(Module('view_ranking'));
