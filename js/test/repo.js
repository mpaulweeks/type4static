
var store = Module("store");
var repo = Module("repo");

function test_repo(){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = create_tester("repo");

    function tests(){
        var now = new Date(2015, 10, 01);


        var masticore = repo.get_card_by_name("Masticore");
        tester.assert(
            'get_card_by_name',
            masticore.name == "Masticore"
        );

        tester.assert(
            'get_statuses',
            repo.get_statuses(masticore).length > 0
        );

        tester.assert(
            'get_status_code',
            repo.get_status_code(masticore, now) == repo.IN_STACK
        );

        tester.assert(
            'get_by_date_and_status',
            repo.get_by_date_and_status(now, repo.IN_STACK).length > 0
        );

        tester.close();
    };

    store.load(tests, TEST_FILE);
}