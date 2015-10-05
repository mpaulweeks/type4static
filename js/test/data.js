
function test_data(){

    var tester = Module("tester").create("data");
    var store = Module("store");

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
                card_missing_status.push(card_id);
            }
        }
        tester.assert(
            'every card has a status',
            card_missing_status.length == 0
        );

        var status_missing_card = [];
        for (var i = 0; i < status_card_ids.length; i++){
            if (status_card_ids[i] && !card_ids[i]){
                status_missing_card.push(card_id);
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

        tester.close();
    };

    store.load(tests);
}
