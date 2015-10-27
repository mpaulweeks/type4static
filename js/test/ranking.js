
function test_ranking(callback){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("ranking", callback);
    var store = Module("store");
    var ranking = Module("ranking");

    function tests(){

        tester.assert(
            "smoke_test",
            true
        );

        tester.close();
    };

    store.load_ranking(tests, TEST_FILE);
}