
function test_store(callback){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("store", callback);
    var store = Module("store");

    tester.assert(
        'Store starts empty',
        $.isEmptyObject(store.data)
    );

    store.load(function (){
        tester.assert(
            'Store becomes non-empty',
            store.data != {}
        );
        tester.assert(
            'Store contains cards data',
            store.data.card[0].name != null
        );
        tester.assert(
            'Store contains status data',
            store.data.status[0].card_id != null
        );
        tester.assert(
            'Store contains multiverse data',
            store.multiverse.masticore != null
        );
        tester.assert(
            'all_cards defaults to null',
            store.all_cards == null
        );

        var card_length = store.data.card.length;

        store.data = null;
        store.load_cards(function(){
            tester.assert(
                'load_cards() loads stack data',
                store.data.card.length == card_length
            );
            tester.assert(
                'load_cards() loads all_cards lower case',
                store.all_cards.masticore.cmc == 4
            );

            store.load_ranking(function (){
                tester.assert(
                    'load_ranking() loads stack data',
                    store.data.card.length == card_length
                );
                tester.assert(
                    'load_ranking() loads ranking data',
                    store.ranking_raw.length > 0
                );

                tester.close();
            }, TEST_FILE);
        }, TEST_FILE);
    }, TEST_FILE);
}