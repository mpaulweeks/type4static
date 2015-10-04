var repo = Module("repo");

(function(module){

    var header = '<h3 class="cardlist-title">{1}</h3>';
    var cardlist = '<div class="cardlist" data-art="false">{1}</div>';
    var count = '<span>{1} cards</span>';
    var cardlistdisplay = '<div class="cardlistdisplay">{1}</div>';
    var card_template = '<a href="http://magiccards.info/query?q={1}" target="_blank"><img class="cardimage" alt="{1}" src="{2}"><img/></a>';

    var status_names = {}
    status_names[repo.IN_STACK] = 'Current list';
    status_names[repo.GOING_IN_STACK] = 'Cards I want to add';
    status_names[repo.REMOVED_FROM_STACK] = 'Cards I have tried and removed';
    status_names[repo.REJECTED_FROM_STACK] = 'Cards I will never consider';

    function str_format(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    }
    
    function get_img_url(card){
        var card_mid = store.data.multiverse[card.name.toLowerCase()];
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=' + card_mid;
    };

    function get_img_tag(card){
        return str_format(card_template, card.name, get_img_url(card));
    };

    function display_status(date, status){
        var card_html = "";
        var cards = repo.get_by_date_and_status(date, status);
        for (var i = 0; i < cards.length; i++){
            var img_tag = get_img_tag(cards[i]);
            card_html += img_tag;
        }

        var header_html = str_format(header, status_names[status]);
        var inner_html = str_format(count, cards.length) + str_format(cardlistdisplay, card_html);
        var list_html = str_format(cardlist, inner_html);
        $(".container").append(header_html + list_html);
    }

    module.run = function(){
        var date = new Date();
        for (var status in status_names){
            display_status(date, status);
        }
    }


})(Module('view'));