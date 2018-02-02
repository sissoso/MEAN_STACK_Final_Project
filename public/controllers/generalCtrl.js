var app = angular.module('general', ['ngFileUpload']);


app.controller('generalCtrl', function($scope, $http,Upload)
{
    var availabeScreens;

    var refresh=function()
    {
        $http.get('/loadScreens').success(function (response) {
            $scope.screens = response;
            availabeScreens = response;

        });
    }
    refresh();

    $scope.removeScreen=function(id){
        $http.delete('/removeScreen/' + id).success(function (response) {
            refresh();
        })
    }

    $scope.addScreen=function (screenNum) {
        //convert from array of objects to array of strings
        var stringArrayOfScreens=availabeScreens.map(function(item){
            return item['screen'];
        });
        //check if screen already exist
       if(!(stringArrayOfScreens.includes(screenNum.screen))){
        $http.post('/addScreen', screenNum).success(function (response) {
            console.log(response);
            refresh();
        })

    }
    else
       {
           alert("screen already exist!!");

       }
    }


});