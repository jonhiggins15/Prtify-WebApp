var authDone = false;
var party;

firebase.auth().onAuthStateChanged(function(user) {
  var isAnonymous = user.isAnonymous;
  uid = user.uid;
  var json = getJson();
  found = false;
  for (var u in json.users) {
    if (u == uid) {
      party = json.users[u].party;
      found = true;
    }
  }
  // if (!found) {
  //   window.location.assign('index.html');
  // }
  authDone = true;
});


setTimeout(function(){
  var partyRef = firebase.database().ref('parties/' + party + '/queue');
  partyRef.on('value', function(snapshot) {
    var info = snapshot.val();
    var songList = []
    for(var song in info){
      info[song].total = info[song].upvotes - info[song].downvotes;
      songList.push(info[song]);
    }
    console.log(songList);
    songList.sort();
    songList.sort(function(a, b){
      return b.total - a.total;
    });
    console.log(songList);
  });
}, 500);



















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
