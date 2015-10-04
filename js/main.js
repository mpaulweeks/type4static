
var store = Module('store');
var repo = Module('repo');

function str_format(str) {
    var args = arguments;
    return str.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

function get_img_tag(card){
    var template = '<a href="http://magiccards.info/query?q={1}" target="_blank"><img class="cardimage" alt="{1}" src="{2}"><img/></a>';
    return str_format(template, card.name, repo.get_img_url(card));
}

function run(data_file){
    store.load(function (){
        var now = new Date();
        var cards = repo.get_by_date_and_status(now, repo.IN_STACK);
        for (var i = 0; i < cards.length; i++){
            $('.cardlistdisplay').append(get_img_tag(cards[i]));
        }
    });
}