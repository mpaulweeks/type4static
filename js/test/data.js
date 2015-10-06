
function test_data(callback){

    var tester = Module("tester").create("data", callback);
    var store = Module("store");
    var repo = Module("repo");

    function tests(){
        var card_ids = [];
        var status_card_ids = [];
        var status_codes = [];
        var card_names = {};
        for (var i = 0; i < store.data.card.length; i++){
            var card = store.data.card[i];
            card_ids[card.id] = true;

            var lower_name = card.name.toLowerCase();
            if (card_names.hasOwnProperty(lower_name)){
                card_names[lower_name] += 1;
            } else {
                card_names[lower_name] = 1;
            }
        }
        for (var i = 0; i < store.data.status.length; i++){
            var status = store.data.status[i];
            status_card_ids[status.card_id] = true;
            status_codes[status.status] = true;
        }

        var dupe_names = [];
        for (var name in card_names){
            if (card_names[name] > 1){
                dupe_names.push(name);
            }
        }
        tester.assert(
            'every card name is unique',
            dupe_names.length == 0,
            dupe_names
        );


        var card_missing_status = [];
        for (var i = 0; i < card_ids.length; i++){
            if (card_ids[i] && !status_card_ids[i]){
                card_missing_status.push(card_ids[i]);
            }
        }
        tester.assert(
            'every card has a status',
            card_missing_status.length == 0
        );

        var status_missing_card = [];
        for (var i = 0; i < status_card_ids.length; i++){
            if (status_card_ids[i] && !card_ids[i]){
                status_missing_card.push(status_card_ids[i]);
            }
        }
        tester.assert(
            'every status has a card',
            status_missing_card.length == 0
        );

        var legal_status_codes = [false, true, true, true, true];
        var illegal_status_codes = [];
        for (var i = 0; i < status_codes.length; i++){
            if (status_codes[i] && !legal_status_codes[i]){
                illegal_status_codes.push(i);
            }
        }
        tester.assert(
            'all status codes are 1-4',
            illegal_status_codes.length == 0,
            JSON.stringify(status_codes)
        );

        var removed_cards = [];
        for (var ci = 0; ci < store.data.card.length; ci++){
            var card = store.data.card[ci];
            var statuses = repo.get_statuses(card);
            var min_removed = null;
            var min_added = null;
            for (var si = 0; si < statuses.length; si++){
                var status = statuses[si];
                if (status.status == repo.IN_STACK && (min_added == null || status.timestamp < min_added)){
                    min_added = status.timestamp;
                }
                if (status.status == repo.REMOVED_FROM_STACK && (min_removed == null || status.timestamp < min_removed)){
                    min_removed = status.timestamp;
                }
            }
            if (min_removed && !min_added || min_removed < min_added){
                removed_cards.push(card.name + ' ' + min_removed + ' | ');
            }
        }
        // tester.assert(
        //     'every card removed has been added',
        //     removed_cards.length == 0,
        //     removed_cards
        // );

        tester.close();
    };

    store.load(tests);
}
