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
            if (!chunk.hasOwnProperty('username')){
                return;
            }
            chunk.data.forEach(function (vote){
                var winner_name = vote.winner;
                var loser_name = vote.options[0];
                if (winner_name == loser_name){
                    loser_name = vote.options[1];
                }
                scoreboard.record(winner_name, loser_name);
            });
        });

        return scoreboard;
    }


})(Module('ranking'));
