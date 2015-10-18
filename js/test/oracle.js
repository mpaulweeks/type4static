
function test_oracle(callback){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("oracle", callback);
    var store = Module("store");
    var oracle = Module("oracle");

    function tests(){

        tester.close();
    };

    store.load_cards(tests, TEST_FILE);
}