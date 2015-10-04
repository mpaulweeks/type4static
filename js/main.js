
var store = Module('store');
var view = Module('view');

function run(data_file){
    store.load(function (){
        var now = new Date();
        var cards = repo.get_by_date_and_status(now, repo.IN_STACK);
        for (var i = 0; i < cards.length; i++){
            $('.cardlistdisplay').append(get_img_tag(cards[i]));
        }
    });
}