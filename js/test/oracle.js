
function test_oracle(callback){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("oracle", callback);
    var store = Module("store");
    var oracle = Module("oracle");

    function tests(){

        var res = oracle.judge_cards(['plumeveil', 'dismiss', 'masticore']);
        tester.assert(
            "calculated flash",
            res.dismiss.data.flash && res.plumeveil.data.flash && !res.masticore.data.flash,
            JSON.stringify(res)
        );

        tester.close();
    };

    store.load_cards(tests, TEST_FILE);
}