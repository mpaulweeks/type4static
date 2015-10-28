(function(module){

    var elo = Module("elo");

    var UNKNOWN_JUDGE = 'Unknown';

    function scoreboard_factory(){
        var api = {};
        var ledger = {};

        api.get_all = function(){
            var cards = [];
            for (var c in ledger){
                cards.push(ledger[c]);
            }
            return cards;
        };

        api.get = function(name){
            if (!ledger.hasOwnProperty(name)){
                var player = {};
                player.name = name;
                player.score = 1200;
                ledger[name] = player;
            }
            return ledger[name];
        };

        api.record = function(winner_name, loser_name){
            var winner = api.get(winner_name);
            var loser = api.get(loser_name);

            var winner_expected = elo.getExpected(winner.score, loser.score);
            var loser_expected = elo.getExpected(loser.score, winner.score);
            winner.score  = elo.updateRating(winner_expected, 1, winner.score);
            loser.score  = elo.updateRating(loser_expected, 0, loser.score);
        };

        return api;
    }

    function get_rating_date(rating_chunk){
        if (rating_chunk.hasOwnProperty("timestamp")){
            return new Date(rating_chunk.timestamp);
        }
        return new Date(2015, 9, 22);
    }

    module.sort_ratings = function(ratings){
        ratings.sort(function (a,b){
            var a_date = get_rating_date(a);
            var b_date = get_rating_date(b);
            if (a_date < b_date){ return -1; }
            if (a_date > b_date){ return 1; }
            return 0;
        })
    }

    module.process_ratings = function(ratings, judges){
        var scoreboard = scoreboard_factory();
        judges = judges || module.get_judges(ratings);

        ratings.forEach(function (chunk){
            var judge = chunk.username || UNKNOWN_JUDGE;
            if (judges.indexOf(judge) == -1){
                return;
            }

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

    module.get_judges = function(ratings){
        var judges = {};
        judges[UNKNOWN_JUDGE] = true;

        ratings.forEach(function (chunk){
            if (chunk.hasOwnProperty('username')){
                judges[chunk.username] = true;
            }
        });

        return Object.keys(judges);
    }


})(Module('ranking'));
