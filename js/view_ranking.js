(function(module){

    var tool = Module("tool");
    var store = Module("store");
    var ranking = Module("ranking");

    module.run = function(){
        tool.load_navbar();

        var cards = ranking.process_ratings(store.ranking_raw).get_all();

        cards.sort(function (a,b){
            if (a.score > b.score){ return -1; }
            if (a.score < b.score){ return 1; }
            return 0;
        });

        cards.forEach(function (card){
            var html = card.score + " - " + card.name + "<br/>";
            $("#rankings").append(html);
        });
    };

})(Module('view_ranking'));
