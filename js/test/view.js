
function test_view(callback){

    var tester = Module("tester").create("view", callback);
    var store = Module("store");
    var view_index = Module("view_index");
    var view_category = Module("view_category");
    var view_status = Module("view_status");

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
            'category.run() smoke test',
            view_category.run() != 1
        );
        tester.assert(
            'status.run() smoke test',
            view_status.run() != 1
        );

        tester.close();
    };

    store.load(tests);
}
