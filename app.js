var app = angular.module('myApp', ['ui.router','ngToast', 'textAngular']);
app.run(function($rootScope,$state){
    $rootScope.fq = true;
    var em=" ";
    //$state.go('home');
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
        .state('gquiz',{
            url:'/gquiz',
            templateUrl: 'structure/instructions.html',
            controller: "GiveQuiz"
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

app.controller('GiveQuiz', function($scope, $http){
  
});

app.controller('ChatCtrl', function($scope, $http){
  
});

app.controller('QuizCtrl', function($scope, $http, $rootScope, $timeout,$location){
    $scope.inst = false;
    $scope.qf = false;
    $scope.qh = true;
    var count = 0;
    var sum = 0;
    var answ;
    console.log('em',em);
    $http({
        url : 'http://localhost:8080/getcs',
        method : "POST",
        data : em
    }).then(function(httpResponse){

    },function myError(response) {
        
    });
    $scope.squiz = function(){
        $http({
            url : 'http://localhost:8080/getques',
            method : "GET"
            }).then(function mySuccess(response) {
                //console.log("next clicked")
                $rootScope.fq = false;
                console.log(response.data[0].q);
                $scope.inst = false;
                $scope.qf = true;
                answ = response.data;
                $scope.question= response.data[0].q;
                $scope.qn = response.data[0].id;
                $scope.buttonname = 'Next';
                $scope.tmt = false;
        });
    };
    $scope.next = function(ans){
        console.log('count',count);
        console.log('ans ',ans);
        if(ans=="a"){
            sum = sum + 0;
        }
        else if(ans=="b"){
            sum = sum + 1;
        }
        else if(ans=="c"){
            sum = sum + 2;
        }
        else if(ans=="d"){
            sum = sum + 3;
        }
        else {
            sum = sum + 4;
        }
        console.log('sum ',sum);
        count = count + 1;
        if(count==24){
            $scope.buttonname = 'Submit';
            $timeout(function(){
                $scope.question = answ[count].q;
                $scope.qn = answ[count].id;
            },800);   
        }
        else if(count>=25){
            $rootScope.fq = true;
            alert("test submitted sucessfully");
        }
        else{
            $timeout(function(){
                $scope.question = answ[count].q;
                $scope.qn = answ[count].id;
                $scope.ki = true;
            },80);   
        }
    };
});
app.controller('ActivityCtrl', function($scope, $http){
  
});
app.controller('NotificationCtrl', function($scope, $http){
  
});

app.controller('MainCtrl', function($scope, $state, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called");
        em=" ";
        //localStorage.removeItem('http://127.0.0.1:8080-jwt');
            console.log("logged out");
            $timeout(function(){
                $rootScope.loggedIn = false;
                $state.go('home');
            },500);
    }
});
app.controller('LoginCtrl', function($scope, $http, $location, $state, $timeout,$rootScope, ngToast){
    $scope.p = false;
    $scope.notific = '';
    $scope.login = function(){
        console.log('Login clicked');
        $http({
            url: 'http://localhost:8080/loginuser',
            method: 'POST',
            data: $scope.user
        }).then(function(httpResponse){
            console.log(httpResponse);
            var string = httpResponse.data;
            string = string.split(" ");
            var stringArray = new Array();
            for(var i =0; i < string.length; i++){
                stringArray.push(string[i]);
            }
            if(stringArray[0]=="Ok")
            {
                ngToast.create("Login successful");
                $scope.p = false;
                $scope.notific = '';
                $rootScope.displayName = stringArray[2] ;
                em=stringArray[3];
                console.log(em);
                $timeout(function(){
                    $rootScope.loggedIn = true;
                    if(stringArray[1]=="v")
                    {
                        $rootScope.k = true;
                    }
                    else
                    {
                        $rootScope.k = false;
                    }
                    $state.go('home');
                },2000);
                console.log(stringArray[2]);
                //$rootScope.fq = false;
            }
            else if(stringArray[0]=="EPDM")
            {
                //ngToast.create("Email and Password does not Match");
                $scope.p = true;
                $scope.notific = 'Email and Password does not Match';
            }
            else if(stringArray[0]=="EDNE")
            {
                //ngToast.create("Account with this email does not Exists");
                $scope.p = true;
                $scope.notific = 'Account with this Email does not Exists';
            }
            else
            {
                //ngToast.create("Login Failed");
                $scope.p = true;
                $scope.notific = 'Login Failed. Server Error';
            }
        }, function myError(response) {
            $scope.p = true;
            $scope.notific = 'Login Failed. Server Error';
            console.log("Login Failed.Server error.")
        });
    };

});


app.controller('SignUpCtrl', function($scope, $http) {
    $scope.statusMsg = '';
    $scope.inactive = false;
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
            url: 'http://localhost:8080/registercheck',
            method: 'POST',
            data: $scope.newUser
        }).then(function(httpResponse){
            console.log('r :',httpResponse);
            $scope.two = true;
            $scope.one = false;
        })*/
        $scope.two = true;
        $scope.one = false;
        $scope.inactive = true;
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

