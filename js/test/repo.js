
function test_repo(callback){

    var TEST_FILE = "json/stack/2015-10-04.json";
    var tester = Module("tester").create("repo", callback);
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
            'get_card_by_name is case-insensitive',
            repo.get_card_by_name("MaStIcoRe") == masticore
        );

        tester.assert(
            'get_card_by_id',
            repo.get_card_by_id(masticore.id).name == "Masticore"
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
            'get_multiverse_id_by_name',
            repo.get_multiverse_id_by_name(masticore.name) > 0
        );

        tester.assert(
            'get_all_cards',
            repo.get_all_cards().length == 337
        );

        var cards = [masticore];
        tester.assert(
            'filter_cards_by_categories on match',
            repo.filter_cards_by_categories(cards, ["is_masticore"]).length == 1
        );
        tester.assert(
            'filter_cards_by_categories on miss',
            repo.filter_cards_by_categories(cards, ["is_instant"]).length == 0
        );
        tester.assert(
            'filter_cards_by_categories handles bad category miss',
            repo.filter_cards_by_categories(cards, ["blerp"]).length == 0
        );
        tester.assert(
            'filter_cards_by_categories w/ multiple',
            repo.filter_cards_by_categories(cards, ["is_masticore", "is_artifact"]).length == 1
        );
        tester.assert(
            'filter_cards_by_categories w/ conflict',
            repo.filter_cards_by_categories(cards, ["is_masticore", "is_instant"]).length == 0
        );

        tester.assert(
            'get_relevant_dates',
            Object.keys(repo.get_relevant_dates()).length == 9,
            Object.keys(repo.get_relevant_dates()).length
        );

        var changes = [{
            card_id: masticore.id,
            category: "is_instant",
            new_val: false
        }];
        var expected = JSON.stringify({
            card: store.data.card,
            status: store.data.status
        });
        tester.assert(
            'update_category potential no-op',
            JSON.stringify(repo.update_category(changes)) == expected
        );

        var timestamp_1 = new Date(2016, 10, 20);
        var timestamp_2 = new Date(2016, 10, 21);
        var timestamp_3 = new Date(2016, 10, 22);
        var timestamp_4 = new Date(2016, 10, 23);
        var timestamp_5 = new Date(2016, 10, 24);
        store.data = repo.update_status(["Masticore"], repo.REMOVED_FROM_STACK, timestamp_2);
        store.data = repo.update_status(["_bleep"], repo.IN_STACK, timestamp_4);
        store.data = repo.update_status(["_bloop"], repo.IN_STACK, timestamp_4);
        tester.assert(
            'update_status: cards before = 240',
            repo.get_by_date_and_status(timestamp_1, repo.IN_STACK).length == 240
        );
        tester.assert(
            'update_status: cards after removing Masticore = 239',
            repo.get_by_date_and_status(timestamp_3, repo.IN_STACK).length == 239,
            JSON.stringify(repo.get_statuses(masticore))
        );
        tester.assert(
            'update_status: cards after adding bleep & bloop = 241',
            repo.get_by_date_and_status(timestamp_5, repo.IN_STACK).length == 241
        );

        tester.close();
    };

    store.load(tests, TEST_FILE);
}