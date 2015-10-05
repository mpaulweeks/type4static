
function test_view(){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("view");
    var store = Module("store");
    var view = Module("view");

    function mocks(){
        Module("autocard").init = function(){};
    };

    function tests(){
        mocks();

        tester.assert(
            'run_index smoke test',
            view.run_index() != 1
        );

        tester.assert(
            'run_edit smoke test',
            view.run_edit() != 1
        );
        tester.close();
    };

    store.load(tests, TEST_FILE);
}