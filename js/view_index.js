(function(module){

    var tool = Module("tool");
    var repo = Module("repo");
    var autocard = Module("autocard");

    var str_format = tool.str_format;
    function get_img_url (card){
        return tool.get_img_url(repo.get_multiverse_id(card));
    }

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
        '<td><a href="{4}">Filter</a></td>' +
        '</tr>'
    );
    var CATEGORY_LINK = '{1}?category={2}{3}';

    var status_names = {}
    status_names[repo.IN_STACK] = 'Current list';
    status_names[repo.GOING_IN_STACK] = 'Cards I want to add';
    status_names[repo.REMOVED_FROM_STACK] = 'Cards I have tried and removed';
    status_names[repo.REJECTED_FROM_STACK] = 'Cards I will never consider';

    //this module shouldn't persist more than one request
    var request = {};
    request.card_img = {};
    request.date = tool.now();
    request.custom_date_string = null;
    request.category = null;

    function get_img_tag(card){
        return str_format(card_img_template, card.name, get_img_url(card));
    };

    function get_text_tag(card){
        return str_format(card_text_template, card.name);
    };

    function get_cards(status){
        var cards = repo.get_by_date_and_status(request.date, status);
        var category = request.category;
        if (category){
            cards = repo.filter_cards_by_category(cards, category);
        }
        return cards;
    }

    function get_card_html(status, image){
        var card_html = "";
        var cards = get_cards(status);
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

    function toggle_images(status){
        var show_image = !request.card_img[status];
        request.card_img[status] = show_image;

        var card_html = get_card_html(status, show_image);
        var div = $("#cardlistdisplay_" + status);
        div.html(card_html);
        if (show_image){
            div.removeClass("columned");
        } else {
            div.addClass("columned");
        }
    };

    function display_status(status){
        var cards = get_cards(status);
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
            toggle_images(status);
        });
        toggle_images(status);
        autocard.init();
    };

    function read_url_param(param_name){
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
        if (vars.hasOwnProperty(param_name)){
            return vars[param_name];
        }
        return null;
    };

    function filter_url(category){
        var prefix = tool.is_local ? "index.html" : "";
        var category_id = category == null ? "" : category;
        var timestamp = request.custom_date_string ? "&timestamp=" + request.custom_date_string : "";
        return str_format(CATEGORY_LINK, prefix, category_id, timestamp);
    }

    function display_filter_row(cards, category){
        var total_cards = cards.length;
        if(category){
            cards = repo.filter_cards_by_category(cards, category);
        }
        var percentage = parseInt(100*cards.length/total_cards);
        var css_class = category == request.category ? "success" : "";
        var label = category == null ? 'Total' : category;
        var row_html = str_format(filter_table,
            cards.length, percentage, label, filter_url(category), css_class
        );
        $('#filter_categories').append(row_html);
    };

    module.run = function(){
        var category = read_url_param("category");
        request.category = category ? category : null;
        var timestamp = read_url_param("timestamp");
        if (timestamp){
            request.date = tool.date_from_string(timestamp);
            request.custom_date_string = timestamp;
        }

        for (var status in status_names){
            display_status(status);
        }

        var in_cards = repo.get_by_date_and_status(request.date, repo.IN_STACK);
        display_filter_row(in_cards);
        for (var i = 0; i < repo.CATEGORIES.length; i++){
            display_filter_row(in_cards, repo.CATEGORIES[i]);
        }
    };

})(Module('view_index'));
