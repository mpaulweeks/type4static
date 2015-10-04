
function test_view(){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("view");
    var store = Module("store");
    var view = Module("view");

    function tests(){
        tester.assert(
            'run doesn\'t shit the bed',
            view.run() != 1
        );
        tester.close();
    };

    store.load(tests, TEST_FILE);
}