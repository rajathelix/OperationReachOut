var app = angular.module('myApp', ['ui.router','ngToast', 'textAngular']);
app.run(function($rootScope,$state){
    $rootScope.fq = true;
    $rootScope.qw = true;
    var objUd= null;
    
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

app.controller('HomeCtrl', function($scope,$rootScope, $http){
    console.log('entered Home page');
    $rootScope.fq = true;
    if($rootScope.loggedIn == true && $rootScope.k == true){
        $http({
            url: 'http://localhost:8080/quizcheck',
            method: 'POST',
            data : objUd
        }).then(function(httpResponse){
            console.log("current status load");
            if(httpResponse.data == "no"){
                $rootScope.qw= true;
            }
            else{
                if(httpResponse.data.result == "nd"){
                    $rootScope.qw= false;
                }
                else if(httpResponse.data.result == "md"){
                    $rootScope.qw= true;
                }
                else if(httpResponse.data.result == "sd"){
                    $rootScope.qw= true;
                }
            }
        },function myError(response) {
            console.log("Error loading user data.")
        });
    }
});

app.controller('ChatCtrl', function($scope, $http){
    console.log('entered Chat page');
    var email = 'hello';
    $http({
        url: 'http://localhost:8080/logi',
        method: 'GET',
    }).then(function(httpResponse){
        console.log("happy");
    });
});

app.controller('QuizCtrl', function($scope, $http, $rootScope, $timeout,$location){
    console.log('entered quiz page');
    $scope.inst = false;
    $scope.qf = false;
    $scope.qh = true;
    $scope.suc = false;
    $scope.fai= false;
    $scope.s4 = false;
    $scope.s3 = false;
    var count = 0;
    var sum = 0;
    var answ;
    $http({
        url: 'http://localhost:8080/quizcheck',
        method: 'POST',
        data : objUd
    }).then(function(httpResponse){
        console.log("current status load");
        if(httpResponse.data == "no"){
            $scope.custs = "Quiz not attempted yet.";
        }
        else{
            $scope.custs = "Last Quiz Results.";
            $scope.s1 = httpResponse.data.s1;
            $scope.s2 = httpResponse.data.s2;
            if(httpResponse.data.result == "nd"){
                $scope.s3 = false;
                $scope.s4 = true;
                $rootScope.qw= false;
            }
            else if(httpResponse.data.result == "md"){
                $scope.s3 = true;
                $scope.s4 = false;
                $rootScope.qw= true;
            }
            else if(httpResponse.data.result == "sd"){
                $scope.s3 = true;
                $rootScope.qw= true;
                $scope.s4 = false;
            }
        }
    });
    $scope.startQ = function(){
        $timeout(function(){
            $scope.inst = true;
            $scope.qh = false;
        },800);
    };
    $scope.squiz = function(){
        $timeout(function(){
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
                //$scope.tmt = false;
        });
    },800);
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
            },80);   
        }
        else if(count>=25){
            var ak='';
            if(sum<=30){
                ak= "nd";
            }
            else if((sum>30)&&(sum<=60)){
                ak = "md";
            }
            else{
                ak = "sd";
            }
            $http({
                url: 'http://localhost:8080/qr',
                method: 'POST',
                data: {
                    email : objUd.email,
                    result : ak,
                    s1 : "dummy",
                    s2 : "dummy",
                }
            }).then(function (httpResponse) {
                if(httpResponse.data=="update" || httpResponse.data=="insert"){
                    console.log('quiz data updated');
                    $timeout(function(){
                        $scope.suc= true;
                        $scope.qf = false;
                    },800);
                }
            },function myError(response) {
                $timeout(function(){
                    $scope.fai= true;
                    $scope.qf = false;
                },800);
            });
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
    console.log('entered activity page');
});
app.controller('NotificationCtrl', function($scope, $http){
    console.log('entered notification page');
});

app.controller('MainCtrl', function($scope, $state, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called");
        objUd= null;
        //localStorage.removeItem('http://127.0.0.1:8080-jwt');
            console.log("logged out");
            $timeout(function(){
                $rootScope.loggedIn = false;
                $state.go('home');
            },500);
    }
});
app.controller('LoginCtrl', function($scope, $http, $location, $state, $timeout,$rootScope, ngToast){
    console.log('entered login page');
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
            objUd = httpResponse.data;
            console.log(objUd);
            console.log(objUd.email);
            /*var string = httpResponse.data;
            string = string.split(" ");
            var stringArray = new Array();
            for(var i =0; i < string.length; i++){
                stringArray.push(string[i]);
            }*/
            if(httpResponse.data.email ==$scope.user.email)
            {
                ngToast.create("Login successful");
                $scope.p = false;
                $scope.notific = '';
                $rootScope.displayName = httpResponse.data.fname;
                $timeout(function(){
                    $rootScope.loggedIn = true;
                    if(httpResponse.data.actype=="v")
                    {
                        $rootScope.k = true;
                    }
                    else
                    {
                        $rootScope.k = false;
                    }
                    $state.go('home');
                },2000);
                console.log(httpResponse.data.fname);
            }
            else if(httpResponse.data=="EPDM")
            {
                //ngToast.create("Email and Password does not Match");
                $scope.p = true;
                $scope.notific = 'Email and Password does not Match';
            }
            else if(httpResponse.data=="EDNE")
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
    console.log('entered registration page');
    $scope.statusMsg = '';
    $scope.inactive = false;
    $scope.newUser = {
        email: 'example@domain.com',
        mobileno: 1000000000
    };
    $scope.three = false;
    $scope.two = false;
    $scope.one = true;
    $scope.a = true;
    $scope.b = false;
    $scope.c = false;
    $scope.myFunc = function() {
        console.log("entries are valid");
        $http({
            url: 'http://localhost:8080/registercheck',
            method: 'POST',
            data: $scope.newUser
        }).then(function(httpResponse){
            console.log('r :',httpResponse);
            if(httpResponse.data == "ok"){
                $scope.two = true;
                $scope.one = false;
                $scope.three = false;
                $scope.inactive = true;
            }
            else if(httpResponse.data == "dmde"){
                $scope.three = true;
                $scope.noti = "Duplicate Mobile and Email.";
            }
            else if(httpResponse.data == "de"){
                $scope.three = true;
                $scope.noti = "Duplicate Email.";
            }
            else if(httpResponse.data == "dm"){
                $scope.three = true;
                $scope.noti = "Duplicate Mobile";
            }
        },function myError(response) {
            $scope.three ="Server Error. Try again.";
        });
        /*
        $scope.two = true;
        $scope.one = false;
        $scope.inactive = true;*/
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
        },function myError(response) {
            console.log('registration failed');
            $scope.a = false;
            $scope.b = false;
            $scope.c = true;
            /*$scope.three = true;
            $scope.noti = 'Regisration Failed. Server Error';
            console.log("Registration Failed.Server error or email and phone already used.")*/
        });
    };
});

