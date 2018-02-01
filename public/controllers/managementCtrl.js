

//load the messages from db
var app = angular.module('management', []);
app.controller('managementCtrl', function($scope, $http, msgService) {

    var refresh= function(){

    $http.get('/loadMessagesId')
        .success(function(response) {
            $scope.messagesArray = response;
            $scope.x="";
        });
    };

refresh();
/**

    $scope.addMsg=function(msgToAdd){
        msgService.addMsg(msgToAdd);
        refresh();
    };
**/

    $scope.addMsg=function(x){

        if(x.name!=undefined) {
            $http.post('/loadMessagesId', x).success(function (response) {
                console.log(response);
                refresh();
            })
        }
    }

/**
 $scope.removeMsg=function (id) {
     msgService.removeMsg(id);
     refresh();
 }
 **/

    $scope.removeMsg= function (id) {
        console.log(id);
        $http.delete('/loadMessagesId/' + id).success(function (response) {
            refresh();
        })

    }

/**
$scope.editMsg=function (id) {
    $scope.x=msgService.editMsg(id);
    //console.log($scope.x.name);



};
**/

    $scope.editMsg= function (id) {
        console.log(id);
        $http.get('/loadMessagesId/' + id).success(function (response) {
            $scope.x=response;


        })
    };

/**
$scope.update=function(id,x){
    msgService.updateMsg(id,x);
    refresh();
}
**/

    $scope.update= function(){
        console.log($scope.x._id);
        $http.put('/loadMessagesId/' + $scope.x._id , $scope.x).success(function(response)
        {
            refresh();
        })
    };

    $scope.deselect= function(){
        $scope.x="";

    }
});