
(function(module){

    var store = Module('store');
    var view_index = Module('view_index');
    var view_edit = Module('view_edit');

    module.index = function(){
        store.load(view_index.run);
    };

    module.edit = function(){
        store.load(view_edit.run);
    };

})(Module("main"));