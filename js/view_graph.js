(function(module){

    var tool = Module("tool");
    var repo = Module("repo");
    var autocard = Module("autocard");

    var str_format = tool.str_format;

    module.run = function(){


        autocard.init();
    };

})(Module('view_graph'));
