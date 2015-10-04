var repo = Module("repo");
var autocard = Module("autocard");

(function(module){

    var header = '<h3 class="cardlist-title">{1}</h3>';
    var cardlist = '<div class="cardlist" data-art="false">{1}</div>';
    var toggle_button = '<button class="toggle" id="toggle_{1}">toggle image view</button>';
    var card_count = '<span>{1} cards</span>';
    var cardlistdisplay = '<div id="cardlistdisplay_{1}" class="cardlistdisplay"></div>';
    var card_img_template = '<a href="http://magiccards.info/query?q={1}" target="_blank"><img class="cardimage" alt="{1}" src="{2}"><img/></a>';
    var card_text_template = '<div><a href="http://magiccards.info/query?q={1}" class="mtgcard" target="_blank">{1}</a></div>';

    var status_names = {}
    status_names[repo.IN_STACK] = 'Current list';
    status_names[repo.GOING_IN_STACK] = 'Cards I want to add';
    status_names[repo.REMOVED_FROM_STACK] = 'Cards I have tried and removed';
    status_names[repo.REJECTED_FROM_STACK] = 'Cards I will never consider';

    var request = {};
    request.card_img = {};

    function str_format(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    
    function get_img_url(card){
        var card_mid = store.data.multiverse[card.name.toLowerCase()];
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=' + card_mid;
    };

    function get_img_tag(card){
        return str_format(card_img_template, card.name, get_img_url(card));
    };

    function get_text_tag(card){
        return str_format(card_text_template, card.name);
    };

    function get_card_html(date, status, image){
        var card_html = "";
        var cards = repo.get_by_date_and_status(date, status);
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];
            var tag = get_text_tag(card);
            if (image){
                tag = get_img_tag(card);
            }
            card_html += tag;
        }
        return card_html;
    };

    function toggle_images(date, status){
        var show_image = !request.card_img[status];
        request.card_img[status] = show_image;

        var card_html = get_card_html(date, status, show_image);
        var div = $("#cardlistdisplay_" + status);
        div.html(card_html);
        if (show_image){
            div.removeClass("columned");
        } else {
            div.addClass("columned");
        }
    };

    function display_status(date, status){
        var cards = repo.get_by_date_and_status(date, status);
        var header_html = str_format(header, status_names[status]);
        var inner_html = (
            str_format(toggle_button, status) +
            str_format(card_count, cards.length) +
            str_format(cardlistdisplay, status)
        );
        var list_html = str_format(cardlist, inner_html);
        $(".container").append(header_html + list_html);

        request.card_img[status] = true;
        $("#toggle_" + status).click(function(){
            toggle_images(date, status);
        });
        toggle_images(date, status);
        autocard.init();
    };

    module.list = function(){
        var date = new Date();
        for (var status in status_names){
            display_status(date, status);
        }
    };

    module.filter = function(){
        module.list();
    };


})(Module('view'));