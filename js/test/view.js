
function test_view(){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("view");
    var store = Module("store");
    var view_index = Module("view_index");
    var view_edit = Module("view_edit");

    function mocks(){
        Module("autocard").init = function(){};
    };

    function tests(){
        mocks();

        tester.assert(
            'index.run() smoke test',
            view_index.run() != 1
        );

        tester.assert(
            'edit.run() smoke test',
            view_edit.run() != 1
        );

        tester.close();
    };

    store.load(tests, TEST_FILE);
}