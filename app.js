var app = angular.module('myApp', ['ui.router','ngToast', 'textAngular']);
app.run(function($rootScope){
    Stamplay.User.currentUser()
    .then(function(res){
        if(res.user){
            $rootScope.loggedIn = true;
            console.log($rootScope.loggedIn);
        }
        else{
            $rootScope.loggedIn = false;
            console.log($rootScope.loggedIn);
        }
    }, function(err){
        console.log("An error occurred while getting current user!");
    });
});
app.config(function($stateProvider, $urlRouterProvider){
    localStorage.removeItem('http://127.0.0.1:8080-jwt');
    $stateProvider
        .state('home',{
            url:'/',
            templateUrl: 'templates/home.html',
            controller: "HomeCtrl"
        })
        .state('login',{
            url:'/login',
            templateUrl: 'templates/login.html',
            controller: "LoginCtrl"
        })
        .state('signup',{
            url:'/signup',
            templateUrl: 'templates/signup.html',
            controller: "SignUpCtrl"
        });
        $urlRouterProvider.otherwise("/");

});

app.controller('HomeCtrl', function($scope, $http){
  
});

app.controller('MainCtrl', function($scope, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called");
        localStorage.removeItem('http://127.0.0.1:8080-jwt');
        Stamplay.User.logout(true,function(){
            console.log("logged out");
            $timeout(function(){
                $rootScope.loggedIn = false;
            })
        });
    }
});

app.controller('SignUpCtrl', function($scope) {
    //$scope.umobileno = 1000000000;
    //$scope.uemail = 'example@domain.com';
    //$scope.name='world';
    $scope.newUser = {
        email: 'example@domain.com',
        mobileno: 1000000000
    };
    $scope.two = false;
    $scope.one = true;
    $scope.myFunc = function() {
        $scope.two = true;
        $scope.one = false;
    };
    $scope.submit = function()
	{
        alert("hello");
    };
});

