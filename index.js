<<<<<<< HEAD
var ref = firebase.database().ref("/rooms");
=======
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    alert("user signed in");
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
  } else {
    alert("signed out");
  }
});
>>>>>>> e966f861ff7dfcec6251a5df886691f3d7866a25
