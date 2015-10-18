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

    var CHART_HTML = '<div class="chart_holder"><div class="chart_title">{1}</div><canvas class="chart" id="{1}" width="400" height="400"></canvas></div>';

    function next_color(){
        color_id = (color_id + 1) % COLORS.length;
        return COLORS[color_id];
    }

    function highlight(color){
        return tool.shadeColor(color, 0.2);
    }

    module.run = function(){
        var cards = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
        var card_names = cards.map(function (card){
            return card.name.toLowerCase();
        });
        var judged_cards = oracle.judge_cards(card_names);
        var summary = oracle.summary(judged_cards);

        oracle.DATAPOINTS.forEach(function (dp_name){
            $("#charts").append(str_format(CHART_HTML, dp_name));
            var graph_data = [];
            var dp_data = summary[dp_name];
            for (var label in dp_data){
                var d = {};
                d.value = dp_data[label].count;
                d.label = label;
                d.color = next_color();
                d.highlight = highlight(d.color);
                graph_data.push(d);
            }
            var ctx = $(".chart#" + dp_name).get(0).getContext("2d");
            var flash = new Chart(ctx).Pie(graph_data);
        });

        autocard.init();
    };

})(Module('view_graph'));
