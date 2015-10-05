
(function(module){

    var store = Module('store');
    var view = Module('view');

    module.index = function(){
        store.load(view.run_index);
    };

    module.edit = function(){
        store.load(view.run_edit);
    };

})(Module("main"));