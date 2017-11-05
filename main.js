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
    songList.sort();
    songList.sort(function(a, b){
      return b.total - a.total;
    });
    $("#queue").empty();
    for(var n in songList){
      $("#queue").append('<li><p>'+songList[n].name+'</p><p>'+songList[n].artist+'</p><p>'+songList[n].image+'</p><button value="'+songList[n].name+'" onclick="upvote(this.value)">Upvote</button><button value="'+songList[n].name+'" onclick="downvote(this.value)">Downvote</button></li>');
    }
  });
}, 500);

function upvote(song){
  var json = getJson();
  var downvotes = json.parties[party].queue[song].downvotes - 1;
  var upvotes = json.parties[party].queue[song].upvotes + 1;
  var alreadyVoted = false;
  for(u in json.parties[party].queue[song].upvoted){
    if(json.parties[party].queue[song].upvoted[u].uid == uid){
      alreadyVoted = true;
    }
  }
  for(u in json.parties[party].queue[song].downvoted){
    if(json.parties[party].queue[song].downvoted[u].uid == uid){
      alreadyVoted = true;
      firebase.database().ref("parties/"+party+"/queue/"+song).update({
        downvotes: downvotes
      });
      firebase.database().ref("parties/"+party+"/queue/"+song+"/downvoted/"+uid).remove()
        .then(function() {
          console.log("sucess");
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
        alreadyVoted = false;
    }
  }
  if(!alreadyVoted){
    firebase.database().ref("parties/"+party+"/queue/"+song).update({
      upvotes: upvotes
    });
    firebase.database().ref("parties/"+party+"/queue/"+song+"/upvoted/"+uid).update({
      uid: uid
    });
  }

}

function downvote(song){
  var json = getJson();
  var downvotes = json.parties[party].queue[song].downvotes + 1;
  var upvotes = json.parties[party].queue[song].upvotes - 1;
  var alreadyVoted = false;
  for(u in json.parties[party].queue[song].downvoted){
    if(json.parties[party].queue[song].downvoted[u].uid == uid){
      alreadyVoted = true;
    }
  }
  for(u in json.parties[party].queue[song].upvoted){
    if(json.parties[party].queue[song].upvoted[u].uid == uid){
      alreadyVoted = true;
      firebase.database().ref("parties/"+party+"/queue/"+song).update({
        upvotes: upvotes
      });
      firebase.database().ref("parties/"+party+"/queue/"+song+"/upvoted/"+uid).remove()
        .then(function() {
          console.log("sucess");
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
        alreadyVoted = false;
    }
  }
  if(!alreadyVoted){
    firebase.database().ref("parties/"+party+"/queue/"+song).update({
      downvotes: downvotes
    });
    firebase.database().ref("parties/"+party+"/queue/"+song+"/downvoted/"+uid).update({
      uid: uid
    });
  }
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
