var repo = Module("repo");

(function(module){

    module.statuses = {
        repo.IN_STACK: 'Current list',
        repo.GOING_IN_STACK: 'Cards I want to add',
        repo.REMOVED_FROM_STACK: 'Cards I have tried and removed',
        repo.REJECTED_FROM_STACK: 'Cards I will never consider'
    }

    module.str_format = function(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
    
    module.get_img_url = function(card){
        var card_mid = store.data.multiverse[card.name.toLowerCase()];
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=' + card_mid;
    };

    module.get_img_tag = function(card){
        var template = '<a href="http://magiccards.info/query?q={1}" target="_blank"><img class="cardimage" alt="{1}" src="{2}"><img/></a>';
        return str_format(template, card.name, repo.get_img_url(card));
    };


})(Module('view'));