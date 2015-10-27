
function run_tests(){
    test_store(function (){
        test_repo(function (){
            test_oracle(function (){
                test_ranking(function (){
                    test_data(function (){
                        test_view();
                    });
                });
            });
        });
    });
}
