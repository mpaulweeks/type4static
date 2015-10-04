
var store = Module('store');
var repo = Module('repo');

function get_img_tag(card){
    return '<img class="cardimage" '
        + 'alt="' + card.id + '" '
        + 'src="'
        + repo.get_img_url(card)
        + '"><img/>';
}

function run(data_file){
    store.load(function (){
        var now = new Date();
        var cards = repo.get_by_date_and_status(now, repo.IN_STACK);
        for (var i = 0; i < cards.length; i++){
            $('body').append(get_img_tag(cards[i]));
        }
    });
}