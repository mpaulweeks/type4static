(function(module){

    var tool = Module("tool");
    var repo = Module("repo");

    var str_format = tool.str_format;
    function get_img_url (card){
        return tool.get_img_url(repo.get_multiverse_id(card));
    }

    function random(items){
        return items[Math.floor(Math.random()*items.length)];
    }

    function random_card(not_card){
        var cards = repo.get_by_date_and_status(tool.now(), repo.IN_STACK);
        var card = null;
        while(card == null || card == not_card){
            card = random(cards);
        }
        return card;
    }

    var count = 0;
    var results = [];
    var options = [];

    var API_KEY = 'zi4GKdKKpJx4ledJ92-Xhw';
    var EMAIL = 'type4stack@gmail.com';

    function submit_data(){
        var to_submit = results;
        results = [];
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
        var card1 = random_card();
        var card2 = random_card(card1);
        options = [card1.name, card2.name];
        $('#choice_1').attr("src", get_img_url(card1));
        $('#choice_2').attr("src", get_img_url(card2));
        $('#choice_1').data("name", card1.name);
        $('#choice_2').data("name", card2.name);
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
        $("#choice_1").click(read_results);
        $("#choice_2").click(read_results);
        refresh_cards();
    };

})(Module('view_rate'));
