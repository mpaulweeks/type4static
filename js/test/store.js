
var store = Module("store");

function test_store(){

    var tester = create_tester("store");

    function pre_load_tests(){
        tester.assert(
            'Store starts empty',
            $.isEmptyObject(store.data)
        );
    };

    function post_load_tests(){
        tester.assert(
            'Store becomes non-empty',
            store.data != {}
        );

        tester.assert(
            'Store contains Masticore',
            store.get_by_name('Masticore')['name'] == 'Masticore'
        );

        tester.close();
    };

    pre_load_tests();
    store.load(post_load_tests);
}