
(function(module){

    var store = Module('store');
    var view = Module('view');
    var view_edit = Module('view_edit');

    module.index = function(){
        store.load(view.run_index);
    };

    module.edit = function(){
        store.load(view_edit.run_edit);
    };

})(Module("main"));