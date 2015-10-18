(function(module){

    var tool = Module("tool");
    var repo = Module("repo");
    var oracle = Module("oracle");
    var autocard = Module("autocard");

    var str_format = tool.str_format;

    var COLORS = [
        '#F7464A',
        '#46BFBD',
        '#FDB45C',
    ];
    var color_id = 0;

    function next_color(){
        color_id = (color_id + 1) % COLORS.length;
        return COLORS[color_id];
    }

    module.run = function(){
        var cards = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
        var card_names = cards.map(function (card){
            return card.name.toLowerCase();
        });
        var judged_cards = oracle.judge_cards(card_names);
        var summary = oracle.summary(judged_cards);

        var flash_data = [];
        for (var label in summary.flash){
            var d = {};
            d.value = summary.flash[label];
            d.label = label;
            d.color = next_color();
            flash_data.push(d);
        }

        // Get context with jQuery - using jQuery's .get() method.
        var ctx = $("#myChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var flash = new Chart(ctx).Pie(flash_data);

        autocard.init();
    };

})(Module('view_graph'));
