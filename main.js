var app = angular.module('main',['firebase']);

app.controller("testController", function($scope, $firebaseObject){
  var ref = firebase.database().ref();
  var obj = $firebaseObject(ref);
  console.log(obj);
});
