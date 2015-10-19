(function(module){

    var tool = Module("tool");
    var repo = Module("repo");
    var oracle = Module("oracle");
    var view_index = Module("view_index");
    var autocard = Module("autocard");

    var str_format = tool.str_format;

    var COLORS = [
        "#d11141",
        "#00b159",
        "#00aedb",
        "#f37735",
        "#ffc425",
        "#a200ff"
    ];
    var color_id = 0;

    var CHART_HTML = '<div class="chart_holder"><div class="chart_title">{1}</div><canvas class="chart" id="{1}" width="250" height="200"></canvas></div>';

    function next_color(){
        color_id = (color_id + 1) % COLORS.length;
        return COLORS[color_id];
    }

    function highlight(color){
        return tool.shadeColor(color, 0.2);
    }

    function display_cards(cards, title){
        view_index.display_card_list(cards, title, 0);
    }

    module.run = function(){
        var cards = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
        var card_names = cards.map(function (card){
            return card.name.toLowerCase();
        });
        var judged_cards = oracle.judge_cards(card_names);
        var summary = oracle.summary(judged_cards);

        for (var dp_name in oracle.DATAPOINTS){
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
            var div = $(".chart#" + dp_name);
            var ctx = div.get(0).getContext("2d");
            var chart = new Chart(ctx).Pie(graph_data);
            div.click(function (evt){
                var info = chart.getSegmentsAtEvent(evt);
                console.log(info);
                var label = info[0].label;
                var cards = dp_data[label].cards;
                var title = dp_name + ' - ' + label;
                display_cards(cards, title);
            });
        }
    };

})(Module('view_graph'));
