
function test_store(){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("store");
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
            store.data.multiverse.masticore != null
        );

        var card_length = store.data.card.length;

        store.load(function(){
            tester.assert(
                'Reloading Store is ok',
                store.data.card.length = card_length
            );

            tester.close();
        }, TEST_FILE);
    }, TEST_FILE);
}