
(function(module){

    var store = Module('store');
    var view = Module('view');

    module.index = function(){
        store.load(view.list);
    };

    module.stats = function(){
        store.load(view.filter);
    };

})(Module("main"));