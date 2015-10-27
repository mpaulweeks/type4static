(function(module){

    function scoreboard_factory(){
        var ledger = {};
        var api = {};

        api.get = function(name){
            if (!ledger.hasOwnProperty(name)){
                var player = {};
                player.name = name;
                player.score = 0;
                ledger[name] = player;
            }
            return ledger[name];
        }

        api.record = function(winner_name, loser_name){
            var winner = api.get(winner_name);
            var loser = api.get(loser_name);

            winner.score += 1;
            loser.score += -1;
        };

        return api;
    }

    module.process_ratings = function(ratings){
        var scoreboard = scoreboard_factory();

        ratings.forEach(function (chunk){
            var vote_data = chunk;
            if (chunk.hasOwnProperty('data')){
                vote_data = chunk.data;
            }
            vote_data.forEach(function (vote){
                var winner_name = vote.winner;
                vote.options.forEach(function (option){
                    if (winner_name != option){
                        scoreboard.record(winner_name, option);
                    }
                });
            });
        });

        return scoreboard;
    }


})(Module('ranking'));
