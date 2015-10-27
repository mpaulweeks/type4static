(function(module){

    var tool = Module("tool");
    var store = Module("store");
    var ranking = Module("ranking");

    module.run = function(){
        tool.load_navbar();

        var scoreboard = ranking.process_ratings(store.ranking_raw);

        var names = Object.keys(scoreboard.ledger);
        names.sort(function (a,b){
            return scoreboard.get(a).score < scoreboard.get(b).score;
        });

        names.forEach(function (name){
            var card = scoreboard.get(name);
            var html = card.score + " - " + card.name + "<br/>";
            $("#rankings").append(html);
        });
    };

})(Module('view_ranking'));
