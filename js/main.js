(function(module){

    var store = Module('store');
    var view_index = Module('view_index');
    var view_category = Module('view_category');
    var view_status = Module('view_status');

    module.index = function(){
        store.load(view_index.run);
    };

    module.category = function(){
        store.load(view_category.run);
    };

    module.status = function(){
        store.load(view_status.run);
    };

})(Module("main"));
