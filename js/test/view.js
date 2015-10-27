
function test_view(callback){

    var tester = Module("tester").create("view", callback);
    var store = Module("store");
    var view_index = Module("view_index");
    var view_graph = Module("view_graph");
    var view_category = Module("view_category");
    var view_category_bulk = Module("view_category");
    var view_status = Module("view_status");
    var view_rate = Module("view_rate");
    var view_ranking = Module("view_ranking");

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
            'graph.run() smoke test',
            view_graph.run() != 1
        );
        tester.assert(
            'category.run() smoke test',
            view_category.run() != 1
        );
        tester.assert(
            'category_bulk.run() smoke test',
            view_category_bulk.run() != 1
        );
        tester.assert(
            'status.run() smoke test',
            view_status.run() != 1
        );
        tester.assert(
            'rate.run() smoke test',
            view_rate.run() != 1
        );
        tester.assert(
            'ranking.run() smoke test',
            view_ranking.run() != 1
        );

        tester.close();
    };

    store.load(tests);
}
