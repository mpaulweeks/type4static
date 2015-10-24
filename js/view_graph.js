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

    var GRAPH_FUNC = {};
    GRAPH_FUNC[oracle.TYPE.PIE] = get_pie_chart;
    GRAPH_FUNC[oracle.TYPE.POLAR] = get_polar_chart;


    var CHART_HTML = '<div class="chart_holder"><div class="chart_title">{1}</div><canvas class="chart" id="{1}" width="250" height="200"></canvas></div>';

    function next_color(){
        color_id = (color_id + 1) % COLORS.length;
        return COLORS[color_id];
    }

    function highlight(color){
        return tool.shadeColor(color, 0.2);
    }

    function lowlight(color){
        return tool.shadeColor(color, -0.2);
    }

    function display_cards(cards, title){
        view_index.display_card_list(cards, title, 0);
    }

    function get_pie_chart(base_chart, dp_data, dp_type){
        var graph_data = [];
        for (var label in dp_data){
            var d = {};
            d.value = dp_data[label].count;
            d.label = label;
            d.color = next_color();
            d.highlight = highlight(d.color);
            graph_data.push(d);
        }
        return base_chart.Pie(graph_data);
    }

    function get_polar_chart(base_chart, dp_data, dp_type){
        var graph_data = [];
        for (var label in dp_data){
            var d = {};
            d.value = dp_data[label].count;
            d.label = label;
            d.color = next_color();
            d.highlight = highlight(d.color);
            graph_data.push(d);
        }
        return base_chart.PolarArea(graph_data);
    }

    function display_factory(chart, dp_data, dp_name){
        var func = function(evt){
            var info = chart.getSegmentsAtEvent(evt);
            console.log(info);
            var label = info[0].label;
            var cards = dp_data[label].cards;
            var title = dp_name + ' - ' + label;
            display_cards(cards, title);
        };
        return func;
    }

    function main(card_names){
        var judged_cards = oracle.judge_cards(card_names);
        var summary = oracle.summary(judged_cards.included);
        if (judged_cards.excluded){
            $("#excluded").html("Excluded: " + judged_cards.excluded.join(", ") + "<hr/>");
        }
        module.summary = summary; // debug

        for (var dp_name in oracle.DATAPOINTS){
            $("#charts").append(str_format(CHART_HTML, dp_name));
            var dp_data = summary[dp_name];
            var div = $(".chart#" + dp_name);
            var base_chart = new Chart(div.get(0).getContext("2d"));
            var chart_factory = GRAPH_FUNC[oracle.DATAPOINTS[dp_name]];
            var chart = chart_factory(base_chart, dp_data, dp_name);
            div.click(display_factory(chart, dp_data, dp_name));
        }
    }

    var CUSTOM_CARDS_HTML = (
        '<div>Paste your stack list here. Each card should be separated by a newline. "1 CARDNAME" is OK.</div>' +
        '<textarea id="card_names" rows="20" style="width: 300px;"></textarea>' +
        '<br/><button id="submit">submit</button>'
    );

    module.run = function(){
        tool.load_navbar();

        var custom = tool.read_url_param("custom");

        if (!custom){
            var cards = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
            var card_names = cards.map(function (card){
                return card.name.toLowerCase();
            });
            main(card_names);
        } else {
            $('#custom').html(CUSTOM_CARDS_HTML);
            $('#submit').click(function (){
                var raw_card_names = $('#card_names').val().split('\n');
                var card_names = [];
                for (var i = 0; i < raw_card_names.length; i++){
                    var raw = raw_card_names[i];
                    if (raw.indexOf("1 ") == 0){
                        raw = raw.split("1 ")[1];
                    }
                    raw = raw.replace(/^\s+|\s+$/g, ''); //trim
                    if (raw){
                        card_names.push(raw.toLowerCase());
                    }
                }
                $('#custom').empty();
                main(card_names);
            });
        }
    };

})(Module('view_graph'));
