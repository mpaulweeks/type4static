(function(module){

    var tool = Module("tool");
    var repo = Module("repo");

    var _cards = [];

    var str_format = tool.str_format;
    function get_img_url (card){
        return tool.get_img_url(repo.get_multiverse_id(card));
    }

    function all_cards(){
        if (_cards.length == 0){
            var in_stack = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
            var soon = repo.get_by_date_and_status(tool.now(), repo.GOING_IN_STACK);
            _cards = in_stack.concat(soon);
        }
        return _cards;
    }

    function random(items){
        return items[Math.floor(Math.random()*items.length)];
    }

    function random_card(not_cards){
        not_cards = not_cards || [];
        var cards = all_cards();
        var card = null;
        while(card == null || not_cards.indexOf(card) != -1){
            card = random(cards);
        }
        var card_img = new Image();
        card_img.src = get_img_url(card);
        return card;
    }

    function random_two_cards(not_cards){
        var card1 = random_card(not_cards);
        return [card1, random_card([card1].concat(not_cards))];
    }

    var count = 0;
    var results = [];
    var options = [];
    var username = "";
    var next_cards = [];

    var API_KEY = 'zi4GKdKKpJx4ledJ92-Xhw';
    var EMAIL = 'type4stack@gmail.com';

    function submit_data(){
        var data = results;
        results = [];
        var to_submit = {
            username: username,
            timestamp: new Date(),
            data: data,
        };
        $.ajax({
            type: 'POST',
            url: 'https://mandrillapp.com/api/1.0/messages/send.json',
            data: {
                'key': API_KEY,
                'message': {
                    'from_email': EMAIL,
                    'to': [{
                        'email': EMAIL,
                        'name': 'ROBOT',
                        'type': 'to'
                    }],
                    'autotext': 'true',
                    'subject': 'RATING DATA',
                    'html': JSON.stringify(to_submit)
                }
            }
        }).done(function(response) {
            console.log(response);
        });
    }

    function refresh_cards(){
        options = [];
        var cards = next_cards;
        next_cards = random_two_cards(cards);
        for (var i = 0; i < 2; i++){
            var card = cards[i];
            options.push(card.name);
            var div = $('#choice_' + i);
            div.attr("src", get_img_url(card));
            div.data("name", card.name);
        }
    }

    function read_results(evt){
        var chosen = $(this);
        var name = chosen.data("name");
        var record = {
            winner: name,
            options: options
        };
        results.push(record);
        console.log(results);
        if (count > 9){
            count = 0;
            submit_data();
        } else {
            count += 1;
        }
        refresh_cards();
    }

    module.run = function(){
        $("#choice_0").click(read_results);
        $("#choice_1").click(read_results);
        $("#setup").submit(function(){
            username = $("#username").val();
            $("#setup").remove();
            next_cards = random_two_cards();
            refresh_cards();
            // prevent submit from completing
            return false;
        });
    };

})(Module('view_rate'));
