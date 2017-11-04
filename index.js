var ref = firebase.database().ref("/rooms");
var uid;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var isAnonymous = user.isAnonymous;
    uid = user.uid;

  } else {
    //signed out
  }
});

function buttonClick(){
  alert("buttonClick");
  var party = $("#partyName").val();
  var json = getJson();
  var partyExists = false;
  for(var p in json.parties){
    if(party == p){
      firebase.database().ref("parties/"+party+"/users/"+uid).update({
        uid: uid
      });
      alert("joining "+party);
    }
  }
  $("#invalidParty").show();

}

//returns a JSON of the database using REST API
function getJson() {
  var xhttp = new XMLHttpRequest();

  //TODO: IMPORTANT: before putting this on the website, change rules and put some
  //form of authentication in the url
  xhttp.open("GET", "https://voteify.firebaseio.com/.json?print=pretty", false);
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  return response;
}
