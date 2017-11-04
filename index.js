firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    alert("user signed in");
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
  } else {
    alert("signed out");
  }
});
