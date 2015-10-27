(function(module){

    var store = Module('store');

    module.index = function(){
        store.load(Module('view_index').run);
    };

    module.graph = function(){
        store.load_cards(Module('view_graph').run);
    };

    module.category = function(){
        store.load(Module('view_category').run);
    };

    module.category_bulk = function(){
        store.load(Module('view_category_bulk').run);
    };

    module.status = function(){
        store.load(Module('view_status').run);
    };

    module.rate = function(){
        store.load(Module('view_rate').run);
    };

    module.ranking = function(){
        store.load_ranking(Module('view_ranking').run);
    };

})(Module("main"));
