var app = angular.module('displayByFilter', []);
app.controller('displayByFilterCtrl', function($scope) {
$scope.display_date=new Date('2018-01-30');
$scope.display_hour=12;
$scope.display_screen=3;
$scope.submit=function(date,hour,screen){
    customStart(date,hour,screen);
}


})