var app = angular.module('myApp', ['ui.router','ngToast', 'textAngular']);
app.run(function($rootScope){
    $rootScope.fq = true;
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
        })
        .state('quiz',{
            url:'/quiz',
            templateUrl: 'templates/quiz.html',
            controller: "QuizCtrl"
        })
        .state('acti',{
            url:'/acti',
            templateUrl: 'templates/acti.html',
            controller: "ActivityCtrl"
        })
        .state('notification',{
            url:'/notification',
            templateUrl: 'templates/notification.html',
            controller: "NotificationCtrl"
        })
        .state('chat',{
            url:'/chat',
            templateUrl: 'templates/chat.html',
            controller: "ChatCtrl"
        });
        $urlRouterProvider.otherwise("/");

});

app.controller('HomeCtrl', function($scope, $http){
  
});

app.controller('ChatCtrl', function($scope, $http){
  
});

app.controller('QuizCtrl', function($scope, $http){
  
});
app.controller('ActivityCtrl', function($scope, $http){
  
});
app.controller('NotificationCtrl', function($scope, $http){
  
});

app.controller('MainCtrl', function($scope, $state, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called");
        //localStorage.removeItem('http://127.0.0.1:8080-jwt');
            console.log("logged out");
            $timeout(function(){
                $rootScope.loggedIn = false;
                $state.go('home');
            },10);
    }
});
app.controller('LoginCtrl', function($scope, $http, $location, $state, $timeout,$rootScope, ngToast){
    $scope.p = false;
    $scope.q = false;
    $scope.notific = '';
    $scope.login = function(){
        console.log('Login clicked');
        $http({
            url: 'http://localhost:8080/loginuser',
            method: 'POST',
            data: $scope.user
        }).then(function(httpResponse){
            console.log(httpResponse);
            var ch = httpResponse.data;
            console.log(ch.substr(0,2));
            if(ch.substr(0,2)=="Ok")
            {
                ngToast.create("Login successful");
                $scope.p = false;
                $scope.q = false;
                $scope.notific = '';
                $rootScope.loggedIn = true;
                $rootScope.displayName = ch.substr(3);
                $timeout(function(){
                    $state.go('home');
                },10);
                console.log(ch.substr(3));
            }
            else if(ch=="EPDM")
            {
                //ngToast.create("Email and Password does not Match");
                $scope.p = true;
                $scope.q = true;
                $scope.notific = 'Email and Password does not Match';
            }
            else if(ch=="EDNE")
            {
                //ngToast.create("Account with this email does not Exists");
                $scope.p = true;
                $scope.q = true;
                $scope.notific = 'Account with this Email does not Exists';
            }
            else
            {
                //ngToast.create("Login Failed");
                $scope.p = true;
                $scope.q = true;
                $scope.notific = 'Login Failed. Server Error';
            }
        })
    };

});


app.controller('SignUpCtrl', function($scope, $http) {
    $scope.statusMsg = '';
    $scope.newUser = {
        email: 'example@domain.com',
        mobileno: 1000000000
    };
    $scope.two = false;
    $scope.one = true;
    $scope.a = true;
    $scope.b = false;
    $scope.c = false;
    $scope.myFunc = function() {
        console.log("entries are valid");
        /*$http({
            url; 'http://localhost:8080/loginuser'
        })*/
        $scope.two = true;
        $scope.one = false;
    };
    $scope.submit= function(){
        console.log('clicked submit');
        $scope.statusMsg = 'Communicating with the server...';
        $http({
            url: 'http://localhost:8080/register',
            method: 'POST',
            data: $scope.newUser
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            if(httpResponse.data=="Ok")
            {
                console.log('registration successful');
                $scope.a = false;
                $scope.b = true;
                $scope.c = false;
            }
            else
            {
                console.log('registration failed');
                $scope.a = false;
                $scope.b = false;
                $scope.c = true;
            }
        })
       };
});

