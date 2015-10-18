(function(module){

    var tool = Module("tool");
    var store = Module("store");
    var repo = Module("repo");

    module.DATAPOINTS = [
        "flash",
        "creature"
    ];

    module.summary = function(judged_cards){
        var result = {};
        module.DATAPOINTS.forEach(function (dp_name){
            var count = {};
            for (var key in judged_cards){
                var card = judged_cards[key];
                var value = card.data[dp_name];
                if (count.hasOwnProperty(value)){
                    count[value] += 1;
                } else {
                    count[value] = 1;
                }
            }
            result[dp_name] = count;
        });
        return result;
    };

    module.judge_cards = function(card_names){
        var results = {};
        for (var i = 0; i < card_names.length; i++){
            var card_name = card_names[i];
            if (card_name.indexOf("/") == -1){
                // omit split cards for now
                results[card_name] = judge_card(card_name);
            }
        }
        return results;
    };

    function get_meta(card_name){
        if (!store.all_cards.hasOwnProperty(card_name)){
            console.log(card_name);
        }
        return store.all_cards[card_name];
    }

    function is_type(card, type){
        if (!card.meta.hasOwnProperty("types")){
            console.log(card);
        }
        for (var i = 0; i < card.meta.types.length; i++){
            if (card.meta.types[i] == type){
                return true;
            }
        }
        return false;
    }

    function text_contains(card, search_terms){
        var found = true;
        search_terms.forEach(function (keyword){
            found = found && card.meta.text.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
        });
        return found;
    }

    function judge_card(card_name){
        var card = {};
        card.name = card_name;
        card.meta = get_meta(card_name);
        card.mid = repo.get_multiverse_id_by_name(card_name);
        card.data = {};

        flash(card);
        creature(card);

        return card;
    }

    function flash(card){
        var res = is_type(card, "Instant") || text_contains(card, ["flash"]);
        card.data.flash = res;
    }

    function creature(card){
        var res = "Not a creature";
        if (is_type(card, "Creature")){
            res = "Small Creature";
            var power = parseInt(card.meta.power);
            if (power >= 7){
                res = "Fatty (Power >= 7)";
            } else if (power >= 4) {
                res = "Mid Sized (Power >= 4)";
            }
        } else if (text_contains(card, ["return", "graveyard", "battlefield"])){
            res = "Reanimate";
        } else if (text_contains(card, ["battlefield", "creature", "token"])){
            res = "Token";
        }
        card.data.creature = res;
    }


})(Module('oracle'));
