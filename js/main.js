(function(module){

    var store = Module('store');
    var view_index = Module('view_index');
    var view_category = Module('view_category');

    module.index = function(){
        store.load(view_index.run);
    };

    module.category = function(){
        store.load(view_category.run);
    };

})(Module("main"));
