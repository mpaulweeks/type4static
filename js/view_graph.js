(function(module){

    var tool = Module("tool");
    var repo = Module("repo");
    var oracle = Module("oracle");
    var autocard = Module("autocard");

    var str_format = tool.str_format;

    module.run = function(){
        var cards = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
        var card_names = cards.map(function (card){
            return card.name.toLowerCase();
        });

        var data = oracle.judge_cards(card_names);

        autocard.init();
    };

})(Module('view_graph'));
