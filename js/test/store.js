
var store = Module("store");

function test_store(){

    var TEST_FILE= "json/data/2015-10-04.json";
    var tester = create_tester("store");

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
            'Store contains cards w/ data',
            store.data.card[0].name != null
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