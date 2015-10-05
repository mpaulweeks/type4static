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
    var filter_table = (
        '<tr class="{5}">' +
        '<td class="text-right col-md-1">{1}</td>' +
        '<td class="text-right col-md-1">{2}%</td>' +
        '<td class="text-center"></td>' +
        '<td>{3}</td>' +
        '<td><a href="index.html?category={4}">Filter</a></td>' +
        '</tr>'
    );

    var status_names = {}
    status_names[repo.IN_STACK] = 'Current list';
    status_names[repo.GOING_IN_STACK] = 'Cards I want to add';
    status_names[repo.REMOVED_FROM_STACK] = 'Cards I have tried and removed';
    status_names[repo.REJECTED_FROM_STACK] = 'Cards I will never consider';

    //this module shouldn't persist more than one request
    var request = {};
    request.card_img = {};
    request.category = null;

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

    function get_cards(date, status){
        var cards = repo.get_by_date_and_status(date, status);
        var category = request.category;
        if (category){
            cards = repo.filter_cards_by_category(cards, category);
        }
        return cards;
    }

    function get_card_html(date, status, image){
        var card_html = "";
        var cards = get_cards(date, status);
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
        var cards = get_cards(date, status);
        var header_html = str_format(header, status_names[status]);
        var inner_html = (
            str_format(toggle_button, status) +
            str_format(card_count, cards.length) +
            str_format(cardlistdisplay, status)
        );
        var list_html = str_format(cardlist, inner_html);
        $("#main_list").append(header_html + list_html);

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

    function read_url_category(){
        var vars = [], hash;
        var q = document.URL.split('?')[1];
        if(q != undefined){
            q = q.split('&');
            for(var i = 0; i < q.length; i++){
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        if (vars.hasOwnProperty("category")){
            return vars.category;
        }
        return null;
    };

    function display_filter_row(category){
        var cards = repo.get_current_cards();
        if(category){
            cards = repo.filter_cards_by_category(cards, category);
        }
        var percentage = parseInt(100*cards.length/request.total_cards);
        var label = category == null ? 'Total' : category;
        var css_class = category == request.category ? "success" : "";
        var row_html = str_format(filter_table,
            cards.length, percentage, label, category, css_class
        );
        $('#filter_categories').append(row_html);
    };

    module.filter = function(){
        request.category = read_url_category();
        module.list();

        request.total_cards = repo.get_current_cards().length;
        display_filter_row();
        for (var i = 0; i < repo.CATEGORIES.length; i++){
            display_filter_row(repo.CATEGORIES[i]);
        }
    };


})(Module('view'));