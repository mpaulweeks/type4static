// https://github.com/dmamills/elo-rank

(function(module){

    var k = 32;

    module.setKFactor = function(n) {
        k = n;
    }

    module.getKFactor = function() {
        return k;
    }

    module.getExpected = function(a,b) {
        return 1/(1+Math.pow(10,((b-a)/400)));
    }

    module.updateRating = function(expected,actual,current) {
        return Math.round(current + k * (actual - expected));
    }

})(Module('elo'));