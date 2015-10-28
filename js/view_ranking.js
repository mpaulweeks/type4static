(function(module){

    var tool = Module("tool");
    var store = Module("store");
    var repo = Module("repo");
    var ranking = Module("ranking");

    var NOW = tool.now();

    var CARD_HTML = '<div class="ranking-status-{1}"> {2} - {3} </div>';

    function all_relevant_cards(){
        var current = repo.get_by_date_and_status(NOW, repo.IN_STACK);
        var future = repo.get_by_date_and_status(NOW, repo.GOING_IN_STACK);
        return current.concat(future);
    }

    function apply_filters(cards){
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

        var list_html = "";
        cards.forEach(function (card){
            var status = repo.get_status_code(card, NOW);
            var html = tool.str_format(CARD_HTML, status, card.score, card.name);
            list_html += html;
        });
        $("#rankings").html(list_html);
    }

    module.run = function(){
        tool.load_navbar();

        display_ranking();
    };

})(Module('view_ranking'));
