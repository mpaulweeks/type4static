(function(module){

    var tool = Module("tool");
    var store = Module("store");

    module.IN_STACK = 1;
    module.GOING_IN_STACK = 2;
    module.REMOVED_FROM_STACK = 3;
    module.REJECTED_FROM_STACK = 4;

    var STATUS_NAMES = {}
    STATUS_NAMES[module.IN_STACK] = 'Cards in the Stack';
    STATUS_NAMES[module.GOING_IN_STACK] = 'Cards I want to add';
    STATUS_NAMES[module.REMOVED_FROM_STACK] = 'Cards I have tried and removed';
    STATUS_NAMES[module.REJECTED_FROM_STACK] = 'Cards I have considered but rejected';
    module.STATUS_NAMES = STATUS_NAMES;

    module.CATEGORIES = [
        "is_instant",
        "is_wrath",
        "is_burn",
        "is_lifegain",
        "is_creature_fat",
        "is_creature_threat",
        "is_creature",
        "is_artifact",
        "is_enchantment",
        "is_land",
        "is_counterspell",
        "is_masticore",
        "is_draw",
        "is_removal_creature",
        "is_removal_artifact",
        "is_removal_enchantment",
        "is_removal_land",
        "is_confiscate",
        "is_morph",
        "is_flying",
        "is_haste",
        "is_recurring",
        "is_cycling",
        "is_reanimate",
        "is_flash_enabler",
        "is_hard_to_kill",
        "is_stack_specific"
    ];

    module.filter_cards_by_categories = function(cards, categories){
        var out = [];
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];
            var include = true;
            for (var c = 0; c < categories.length; c++){
                var category = categories[c];
                include = include && (card.hasOwnProperty(category) && card[category]);
            }
            if (include){
                out.push(card);
            }
        }
        return out;
    };

    module.get_card_by_name = function(card_name){
        var lower_name = card_name.toLowerCase();
        var cards = store.data.card;
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];
            if (card.name.toLowerCase() == lower_name){
                return card;
            }
        }
        console.log(card_name + " not found!")
        return null;
    };

    module.get_card_by_id = function(card_id){
        var cards = store.data.card;
        for (var i = 0; i < cards.length; i++){
            var card = cards[i];
            if (card.id == card_id){
                return card;
            }
        }
        console.log(card_id + " not found!")
    };

    module.get_statuses = function(card){
        var out = [];
        var statuses = store.data.status;
        for (var i = 0; i < statuses.length; i++){
            var status = statuses[i];
            if (status.card_id == card.id){
                out.push(status);
            }
        }
        return out;
    }

    module.get_status_code = function(card, datetime){
        var card_statuses = module.get_statuses(card);
        var latest_status = null;
        var latest_timestamp = null;
        for (var i = 0; i < card_statuses.length; i++){
            var status = card_statuses[i];
            var timestamp = tool.date_from_string(status.timestamp);
            if (timestamp < datetime){
                if (latest_timestamp == null || latest_timestamp < timestamp)
                {
                    latest_status = status;
                    latest_timestamp = timestamp;
                }
            }
        }
        if (latest_status == null){
            return module.GOING_IN_STACK;
        }
        return latest_status.status;
    };

    module.get_by_date_and_status = function(datetime, status){
        var valid_cards = [];
        var all_cards = store.data.card;
        for (var i = 0; i < all_cards.length; i++){
            var card = all_cards[i];
            if (status == module.get_status_code(card, datetime)){
                valid_cards.push(card);
            }
        }
        valid_cards.sort(function(a,b){
            return a.name.localeCompare(b.name);
        });
        return valid_cards;
    };

    module.get_multiverse_id = function(card){
        return module.get_multiverse_id_by_name(card.name);
    };

    module.get_multiverse_id_by_name = function(card_name){
        var fixed_name = card_name.split('/')[0].toLowerCase();
        return store.multiverse[fixed_name];
    };

    module.get_all_cards = function(){
        return store.data.card;
    };

    module.update_category = function(changes){
        $.each(changes, function (index, change){
            var card = module.get_card_by_id(change.card_id);
            card[change.category] = change.new_val;
        });
        return store.data;
    };

    module.get_relevant_dates = function(){
        var dates = {};
        for (var i = 0; i < store.data.status.length; i++){
            var status = store.data.status[i];
            if (status.status == module.IN_STACK || status.status == module.REMOVED_FROM_STACK){
                var raw_timestamp = store.data.status[i].timestamp;
                var datetime = tool.date_from_string(raw_timestamp);
                var date = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + 1);
                var key = date.toDateString();
                dates[key] = date;
            }
        }
        return dates;
    };

    module.get_cards_updated_on_date = function(selected_date){
        var card_ids = [];
        for (var i = 0; i < store.data.status.length; i++){
            var raw_timestamp = store.data.status[i].timestamp;
            var datetime = tool.date_from_string(raw_timestamp);
            var status_date = new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + 1);
            if (status_date >= selected_date && status_date <= selected_date){
                card_ids[store.data.status[i].card_id] = true;
            }
        }
        return card_ids;
    };

    function new_card(name){
        var max_id = 0;
        for (var i = 0; i < store.data.card.length; i++){
            var cid = store.data.card[i].id;
            if (cid > max_id){
                max_id = cid;
            }
        }
        var card = {
            id: max_id + 1,
            name: name
        };
        for (var i = 0; i < module.CATEGORIES.length; i++){
            card[module.CATEGORIES[i]] = false;
        }
        store.data.card.push(card);
        return card
    }

    function new_status(card, status_code, datetime){
        var max_id = 0;
        for (var i = 0; i < store.data.status.length; i++){
            var sid = store.data.status[i].id;
            if (sid > max_id){
                max_id = sid;
            }
        }
        var status = {
            id: max_id + 1,
            card_id: card.id,
            status: status_code,
            timestamp: tool.string_from_date(datetime)
        };
        store.data.status.push(status);
    }

    module.update_status = function(card_names, status_code, datetime){
        for (var i = 0; i < card_names.length; i++){
            var card_name = card_names[i];
            if (card_name){
                var card = module.get_card_by_name(card_name);
                if (!card){
                    card = new_card(card_name);
                }
                new_status(card, status_code, datetime);
            }
        }
        return store.data;
    }


})(Module('repo'));
