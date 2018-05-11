var app = angular.module('myApp', ['ui.router','ngToast', 'textAngular']);
app.run(function($rootScope,$state){
    $rootScope.fq = true;
    $rootScope.qw = true;
    $rootScope.k = false;
    $rootScope.loggedIn == false;
    var ud_obj= null;
    
    //$state.go('home');
});
app.config(function($stateProvider, $urlRouterProvider){
    //localStorage.removeItem('http://127.0.0.1:8080-jwt');
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
    $scope.small = true;
    $scope.big = false;
    $scope.toBig = function(){
        $scope.small = false;
        $scope.big = true;
    };
    $scope.toSmall = function(){
        $scope.small = true;
        $scope.big = false;
    };
    
    if($rootScope.loggedIn == true && $rootScope.k == true){
        $http({
            url: 'http://192.168.123.7:8080/quizcheck',
            method: 'POST',
            data : ud_obj
        }).then(function(httpResponse){
            console.log("current status load");
            if(httpResponse.data == "no"){
                $rootScope.qw= false;
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

app.controller('ChatCtrl', function($scope, $http, $rootScope){
    console.log('entered Chat page');
    if($rootScope.qw == false || $rootScope.loggedIn == false){
        $scope.chaton = false;
    }
    else {
        $scope.chaton = true;
        console.log("logged in");
        if(ud_obj.actype == "v"){
            console.log("depressed");
            $scope.whenv = true;
            $scope.whenc = false;
            $http({
                url: 'http://192.168.123.7:8080/listc',
                method: 'GET'
            }).then(function(httpResponse){
                if(httpResponse.data == 'none'){
                    $scope.moody = true;
                    console.log("none");
                }
                else {
                    console.log("a list");
                    $scope.mood = true;
                    $scope.records = httpResponse.data;
                }
            },function myError(response) {
            });
        }
        else if(ud_obj.actype == "c"){
            $scope.whenc = true;
            $scope.whenv = false;
        }
        else {

        }
    }
    $scope.onc = true;
    $scope.details = function(a){
        $http({
            url: 'http://192.168.123.7:8080/pdet',
            method: 'POST',
            data : {
                email : a
            }
        }).then(function(httpResponse){
            $scope.clck = true;
            $scope.onc = false;
            $scope.name = httpResponse.data.fname + " " + httpResponse.data.lname;
            $scope.ema = httpResponse.data.email;
            $scope.mno = httpResponse.data.mobileno;
            $scope.ads = httpResponse.data.address;
        },function myError(response) {
        });   
    }
});

app.controller('QuizCtrl', function($scope, $http, $rootScope, $timeout,$location){
    console.log('entered quiz page');
    if($rootScope.loggedIn == true){
        if(ud_obj.actype == "v"){
            $scope.inst = false;
            $scope.qf = false;
            $scope.qh = true;
            $scope.suc = false;
            $scope.fai= false;
            $scope.s4 = false;
            $scope.s3 = false;
            $scope.s5 = false;
            $http({
                url: 'http://192.168.123.7:8080/quizcheck',
                method: 'POST',
                data : ud_obj
            }).then(function(httpResponse){
                console.log("current status load");
                if(httpResponse.data == "no"){
                    $scope.custs = "Quiz not attempted yet.";
                    $scope.s5 = true;
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
        }
        else{
            $scope.inst = false;
            $scope.qf = false;
            $scope.qh = false;
            $scope.suc = false;
            $scope.fai= false;
        }

    }
    else {
        $scope.inst = false;
        $scope.qf = false;
        $scope.qh = false;
        $scope.suc = false;
        $scope.fai= false;
    }
    var count_num = 0;
    var sum_num = 0;
    var answ;
    $scope.startQ = function(){
        $timeout(function(){
            $scope.inst = true;
            $scope.qh = false;
        },800);
    };
    $scope.squiz = function(){
        $timeout(function(){
            $http({
                url : 'http://192.168.123.7:8080/getques',
                method : "GET"
            }).then(function mySuccess(response) {
                //console.log("next clicked")
                $rootScope.fq = false;
                //console.log(response.data[0].q);
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
        //console.log('count',count_num);
        //console.log('ans ',ans);
        if(ans=="a"){
            sum_num = sum_num + 0;
        }
        else if(ans=="b"){
            sum_num = sum_num + 1;
        }
        else if(ans=="c"){
            sum_num = sum_num + 2;
        }
        else if(ans=="d"){
            sum_num = sum_num + 3;
        }
        else {
            sum_num = sum_num + 4;
        }
        //console.log('sum ',sum_num);
        count_num = count_num + 1;
        if(count_num==24){
            $scope.buttonname = 'Submit';
            $timeout(function(){
                $scope.question = answ[count_num].q;
                $scope.qn = answ[count_num].id;
            },80);   
        }
        else if(count_num>=25){
            var ak_str='';
            if(sum_num<=30){
                ak_str= "nd";
            }
            else if((sum_num>30)&&(sum_num<=60)){
                ak_str = "md";
            }
            else{
                ak_str = "sd";
            }
            $http({
                url: 'http://192.168.123.7:8080/qr',
                method: 'POST',
                data: {
                    email : ud_obj.email,
                    result : ak_str,
                    s1 : "dummy",
                    s2 : "dummy",
                    noti : "yes"
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
                $scope.question = answ[count_num].q;
                $scope.qn = answ[count_num].id;
                $scope.ki = true;
            },80);   
        }
    };
});
app.controller('ActivityCtrl', function($scope, $http, $rootScope){
    console.log('entered activity page');
    if($rootScope.qw == false || $rootScope.k == false){
        $scope.activity = false;
    }
    else {
        $scope.activity = true;
    }
});
app.controller('NotificationCtrl', function($scope, $http, $rootScope){
    console.log('entered notification page');
    if($rootScope.loggedIn == true){
        $scope.er = false;
        if(ud_obj.actype == "v")
        {
            $scope.qn = true;
            $scope.cn = true;
            $http({
                url: 'http://192.168.123.7:8080/quizcheck',
                method: 'POST',
                data : ud_obj
            }).then(function(httpResponse){
                console.log("current status load");
                if(httpResponse.data == "no" || httpResponse.data.noti == "no"){
                    $scope.gexam= false;
                    $scope.nn = true;
                }
                else{
                    $scope.result_quiz = httpResponse.data.s1;
                    $scope.gexam = true;
                    $scope.nn = false;
                }
            },function myError(response) {
                console.log("Error loading user data.")
                $scope.er = true;
            });
            $scope.cnn = true;
        }
        else if(ud_obj.actype == "c"){
            $scope.qn = false;
            $scope.cn = true;
            $scope.cnn = true;
        }
    }
    else {
        $scope.qn = false;
        $scope.cn = false;
    }
    $scope.readit = function(){
        $http({
            url: 'http://192.168.123.7:8080/qrm',
            method: 'POST',
            data : ud_obj
        }).then(function(httpResponse){
            if(httpResponse.data == "ok"){
                $scope.nn = true;
                $scope.gexam = false;
            }
        }, function myError(response){

        });
    };
});

app.controller('MainCtrl', function($scope, $state, $rootScope, $timeout){
    $scope.logout = function(){
        console.log("logout called");
        ud_obj= null;
        //localStorage.removeItem('http://127.0.0.1:8080-jwt');
            console.log("logged out");
            $timeout(function(){
                $rootScope.loggedIn = false;
                $rootScope.fq = true;
                $rootScope.qw == true;
                $rootScope.k = false;
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
            url: 'http://192.168.123.7:8080/loginuser',
            method: 'POST',
            data: $scope.user
        }).then(function(httpResponse){
            console.log(httpResponse);
            ud_obj = httpResponse.data;
            //console.log(ud_obj);
            console.log(ud_obj.email);
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
                    console.log('k ',$rootScope.k);
                    console.log('qw ',$rootScope.qw);

                    $state.go('home');
                },2000);
                //console.log(httpResponse.data.fname);
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
            url: 'http://192.168.123.7:8080/registercheck',
            method: 'POST',
            data: $scope.newUser
        }).then(function(httpResponse){
            //console.log('r :',httpResponse);
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
            $scope.three = true;
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
            url: 'http://192.168.123.7:8080/register',
            method: 'POST',
            data: $scope.newUser
        }).then(function (httpResponse) {
            //console.log('response:', httpResponse);
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

