
function test_repo(){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("repo");
    var store = Module("store");
    var repo = Module("repo");

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
            'get_status_code in past returns GOING_IN_STACK',
            repo.get_status_code(masticore, new Date(2010,1,1)) == repo.GOING_IN_STACK
        );

        tester.assert(
            'get_by_date_and_status',
            repo.get_by_date_and_status(now, repo.IN_STACK).length > 0
        );

        tester.assert(
            'get_multiverse_id',
            repo.get_multiverse_id(masticore) > 0
        );

        tester.assert(
            'get_current_cards',
            repo.get_current_cards().length == 240
        );

        tester.assert(
            'get_all_cards',
            repo.get_all_cards().length == 337
        );

        var cards = [masticore];
        tester.assert(
            'filter_cards_by_category on match',
            repo.filter_cards_by_category(cards, "is_masticore").length == 1
        );
        tester.assert(
            'filter_cards_by_category on miss',
            repo.filter_cards_by_category(cards, "is_instant").length == 0
        );
        tester.assert(
            'filter_cards_by_category handles bad category miss',
            repo.filter_cards_by_category(cards, "blerp").length == 0
        );

        tester.close();
    };

    store.load(tests, TEST_FILE);
}