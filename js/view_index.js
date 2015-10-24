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
        '<tr class="{6}">' +
        '<td class="text-right col-md-1">{1}</td>' +
        '<td class="text-right col-md-1">{2}%</td>' +
        '<td class="text-center"></td>' +
        '<td>{3}</td>' +
        '<td><a href="{4}">Filter</a></td>' +
        '<td><a href="{5}">+</a></td>' +
        '</tr>'
    );
    var INDEX_LINK = '{1}?{2}';

    var status_names = repo.STATUS_NAMES;

    //this module shouldn't persist more than one request
    var request = {};
    request.date = tool.now();
    request.custom_date_string = null;
    request.categories = null;

    function get_img_tag(card){
        return str_format(card_img_template, card.name, get_img_url(card));
    };

    function get_text_tag(card){
        return str_format(card_text_template, card.name);
    };

    function get_cards(status){
        var cards = repo.get_by_date_and_status(request.date, status);
        if (request.categories){
            cards = repo.filter_cards_by_categories(cards, request.categories);
        }
        return cards;
    }

    function get_card_html(cards, image){
        var card_html = "";
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

    function toggle_images(cards, group_key, show_image){
        var card_html = get_card_html(cards, show_image);
        var div = $("#cardlistdisplay_" + group_key);
        div.html(card_html);
        if (show_image){
            div.removeClass("columned");
        } else {
            div.addClass("columned");
            autocard.init();
        }
    };

    function display_card_list(cards, header_text, group_key){
        cards.sort(function(a,b){
            return a.name.localeCompare(b.name);
        });

        var header_html = str_format(header, header_text);
        var inner_html = (
            str_format(toggle_button, group_key) +
            str_format(card_count, cards.length) +
            str_format(cardlistdisplay, group_key)
        );
        var list_html = str_format(cardlist, inner_html);
        $("#list_" + group_key).html(header_html + list_html);

        var show_image = true;
        var div = $("#toggle_" + group_key);
        div.click(function(){
            show_image = !show_image;
            toggle_images(cards, group_key, show_image);
        });
        div.click();
    }
    module.display_card_list = display_card_list;

    function display_status(status){
        display_card_list(get_cards(status), status_names[status], status);
    };

    function display_changes(){
        if (!request.custom_date_string){
            return;
        }

        var date_card_ids = repo.get_cards_updated_on_date(request.date);

        function is_affected_on_date(card){
            return date_card_ids[card.id];
        }

        var in_cards = get_cards(repo.IN_STACK).filter(is_affected_on_date);
        var out_cards = get_cards(repo.REMOVED_FROM_STACK).filter(is_affected_on_date);

        display_card_list(in_cards, "Changes: Added", "added");
        display_card_list(out_cards, "Changes: Removed", "removed");

        $("#list_removed").append("<hr/>");
    };

    function index_url(categories, date_string){
        categories = categories || [];
        var prefix = tool.is_local ? "index.html" : "";
        var params = date_string == null ? [] : ["timestamp=" + date_string];
        for (var i = 0; i < categories.length; i++){
            params.push("category=" + categories[i]);
        }
        return str_format(INDEX_LINK, prefix, params.join("&"));
    }

    function display_filter_row(cards, category){
        var total_cards = cards.length;
        if(category){
            cards = repo.filter_cards_by_categories(cards, [category]);
        }
        var percentage = parseInt(100*cards.length/total_cards);
        var categories = category ? [category] : [];
        var curr_categories = request.categories ? request.categories : [];

        var label = category ? category : 'Total';
        var is_selected = curr_categories.indexOf(category) != -1 || (category == null && request.categories == null);
        var css_class = is_selected ? "success" : "";
        var only_filter_url = index_url(categories, request.custom_date_string);
        var add_filter_url = index_url(categories.concat(curr_categories), request.custom_date_string);
        var row_html = str_format(filter_table,
            cards.length, percentage, label, only_filter_url, add_filter_url, css_class
        );
        $('#filter_categories').append(row_html);
    };

    function display_dates(){
        var html = '<div><a href="{1}">{2}</a></div>';
        var dates = repo.get_relevant_dates();
        var sorted_keys = Object.keys(dates);
        sorted_keys.sort(function (a,b){
            return dates[b] - dates[a];
        });
        var today_url = index_url(request.categories, "");
        $('#dates').append(str_format(html, today_url, "Today"));
        for (var i = 0; i < sorted_keys.length; i++){
            var key = sorted_keys[i];
            var date = dates[key];
            var date_string = tool.str_format('{1}-{2}-{3}', date.getFullYear(), date.getMonth()+1, date.getDate());
            var url = index_url(request.categories, date_string);
            var label = key;
            $('#dates').append(str_format(html, url, label));
        }
    };

    module.run = function(){
        tool.load_navbar();

        var categories = tool.read_url_param("category", true);
        request.categories = categories ? categories : null;
        var timestamp = tool.read_url_param("timestamp");
        if (timestamp){
            request.date = tool.date_from_string(timestamp);
            request.custom_date_string = timestamp;
        }

        var title_date = request.custom_date_string ? request.date.toDateString() : "TODAY";
        $('#title').html("Stack as of " + title_date);

        if (request.categories){
            $('#subtitle').html('<h4 class="text-center">' + request.categories.join(", ") + '</h4><hr/>');
        }

        display_changes();

        for (var status in status_names){
            display_status(status);
        }

        var in_cards = repo.get_by_date_and_status(request.date, repo.IN_STACK);
        display_filter_row(in_cards);
        for (var i = 0; i < repo.CATEGORIES.length; i++){
            display_filter_row(in_cards, repo.CATEGORIES[i]);
        }

        display_dates();
    };

})(Module('view_index'));
