
function test_oracle(callback){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("oracle", callback);
    var store = Module("store");
    var oracle = Module("oracle");

    function tests(){

        var res = oracle.judge_cards(['plumeveil', 'dismiss', 'masticore']).included;
        tester.assert(
            "calculated flash",
            res.dismiss.data.flash[0] && res.plumeveil.data.flash[0] && !res.masticore.data.flash[0],
            JSON.stringify(res)
        );

        tester.close();
    };

    store.load_cards(tests, TEST_FILE);
}