//chirpApp.js
var app = angular.module("chirpApp", []);


// this $scope variable is injected into this controller but also made available
// to your view where you can then accessing using ng-model. You can access 
// the fields inside $scope variable implicitely in your views
app.controller("mainController", function($scope){
    //controller implementation
    $scope.posts = [];
    $scope.newPost = { created_by : "", text : "", created_at : "" };
    
    
    $scope.post = function(){
        $scope.newPost.created_at = Date.now();
        $scope.posts.push($scope.newPost);
        $scope.newPost = { created_by : "", text : "", created_at : "" }; 
    };

});


app.controller("authController", function($scope) {
    $scope.user = {username : "", password : ""};
    $scope.error_msg = "";
    
    $scope.register = function()
    {
      $scope.error_msg = "registration request for " + $scope.user.username;
    };
    
    $scope.login = function()
    {
      $scope.error_msg = "login request for " + $scope.user.username; 
    };
});

