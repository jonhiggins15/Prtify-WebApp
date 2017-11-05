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


setTimeout(function() {
  $('#headerQueue').text(party + " Queue");
  var partyRef = firebase.database().ref('parties/' + party + '/queue');
  partyRef.on('value', function(snapshot) {
    var info = snapshot.val();
    var songList = []
    for (var song in info) {
      info[song].total = info[song].upvotes - info[song].downvotes;
      songList.push(info[song]);
    }
    songList.sort();
    songList.sort(function(a, b) {
      return b.total - a.total;
    });
    $('#queue').empty();
    for (var n in songList) {
      // $("#queue").append('<li><p>'+songList[n].name+'</p><p>'+songList[n].artist+'</p><p>'+songList[n].image+'</p><button value="'+songList[n].name+'" onclick="upvote(this.value)">Upvote</button><button value="'+songList[n].name+'" onclick="downvote(this.value)">Downvote</button></li>');
      $('#queue').append('<li class="collection-item avatar"> \
        <img src="' + songList[n].image + '" alt="" class="circle"> \
        <span class="title"><b>' + songList[n].name + '</b></span> \
        <p>' + songList[n].album + ' <br>' + songList[n].artist + '<br> \
        </p> \
        <a href="#!" class="secondary-content"> \
          <div> \
            <div> \
              <i class="material-icons" style="opacity: 0.5" value="up" id="' + songList[n].name+"up" + '" >arrow_upward</i><i class="material-icons" value="' + songList[n].name + '" id="' + songList[n].name + '" style="opacity: 0.5">arrow_downward</i> \
            </div> \
            <div> \
              <p class="center" style="font-size: large"><b>' + songList[n].total + '</b></p> \
            </div> \
          </div> \
        </a> \
      </li>');
      var up = document.getElementById(songList[n].name+"up");
      up.addEventListener("click", function() {
        var json = getJson();
        listenSong = $(this).attr('id');
        listenSong = listenSong.slice(0,-2);
        alert(json.parties[party].queue[listenSong].downvotes);
        var downvotes = json.parties[party].queue[listenSong].downvotes - 1;
        var upvotes = json.parties[party].queue[listenSong].upvotes + 1;
        var alreadyVoted = false;
        for (u in json.parties[party].queue[listenSong].upvoted) {
          if (json.parties[party].queue[listenSong].upvoted[u].uid == uid) {
            alreadyVoted = true;
          }
        }
        for (u in json.parties[party].queue[listenSong].downvoted) {
          if (json.parties[party].queue[listenSong].downvoted[u].uid == uid) {
            alreadyVoted = true;
            firebase.database().ref("parties/" + party + "/queue/" + listenSong).update({
              downvotes: downvotes
            });
            firebase.database().ref("parties/" + party + "/queue/" + listenSong + "/downvoted/" + uid).remove()
              .then(function() {
                console.log("sucess");
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });
            alreadyVoted = false;
          }
        }
        if (!alreadyVoted) {
          firebase.database().ref("parties/" + party + "/queue/" + listenSong).update({
            upvotes: upvotes
          });
          firebase.database().ref("parties/" + party + "/queue/" + listenSong + "/upvoted/" + uid).update({
            uid: uid
          });
        }

      });





      var down = document.getElementById(songList[n].name);
      up.addEventListener("click", function() {
        var json = getJson();
        listenSong = $(this).attr('id');
        console.log(json.parties[party].queue[listenSong]);
        var downvotes = json.parties[party].queue[listenSong].downvotes - 1;
        var upvotes = json.parties[party].queue[listenSong].upvotes + 1;
        var alreadyVoted = false;
        for (u in json.parties[party].queue[listenSong].upvoted) {
          if (json.parties[party].queue[listenSong].upvoted[u].uid == uid) {
            alreadyVoted = true;
          }
        }
        for (u in json.parties[party].queue[listenSong].downvoted) {
          if (json.parties[party].queue[listenSong].downvoted[u].uid == uid) {
            alreadyVoted = true;
            firebase.database().ref("parties/" + party + "/queue/" + listenSong).update({
              downvotes: downvotes
            });
            firebase.database().ref("parties/" + party + "/queue/" + listenSong + "/downvoted/" + uid).remove()
              .then(function() {
                console.log("sucess");
              })
              .catch(function(error) {
                console.log("Remove failed: " + error.message)
              });
            alreadyVoted = false;
          }
        }
        if (!alreadyVoted) {
          firebase.database().ref("parties/" + party + "/queue/" + listenSong).update({
            upvotes: upvotes
          });
          firebase.database().ref("parties/" + party + "/queue/" + listenSong + "/upvoted/" + uid).update({
            uid: uid
          });
        }

      });
    }
  });
}, 500);

// function upvote(song) {
//   alert("upvote");
//   var json = getJson();
//   console.log(song);
//   var downvotes = json.parties[party].queue[song].downvotes - 1;
//   var upvotes = json.parties[party].queue[song].upvotes + 1;
//   var alreadyVoted = false;
//   for (u in json.parties[party].queue[song].upvoted) {
//     if (json.parties[party].queue[song].upvoted[u].uid == uid) {
//       alreadyVoted = true;
//     }
//   }
//   for (u in json.parties[party].queue[song].downvoted) {
//     if (json.parties[party].queue[song].downvoted[u].uid == uid) {
//       alreadyVoted = true;
//       firebase.database().ref("parties/" + party + "/queue/" + song).update({
//         downvotes: downvotes
//       });
//       firebase.database().ref("parties/" + party + "/queue/" + song + "/downvoted/" + uid).remove()
//         .then(function() {
//           console.log("sucess");
//         })
//         .catch(function(error) {
//           console.log("Remove failed: " + error.message)
//         });
//       alreadyVoted = false;
//     }
//   }
//   if (!alreadyVoted) {
//     firebase.database().ref("parties/" + party + "/queue/" + song).update({
//       upvotes: upvotes
//     });
//     firebase.database().ref("parties/" + party + "/queue/" + song + "/upvoted/" + uid).update({
//       uid: uid
//     });
//   }
//
// }

function downvote(song) {
  var json = getJson();
  var downvotes = json.parties[party].queue[song].downvotes + 1;
  var upvotes = json.parties[party].queue[song].upvotes - 1;
  var alreadyVoted = false;
  for (u in json.parties[party].queue[song].downvoted) {
    if (json.parties[party].queue[song].downvoted[u].uid == uid) {
      alreadyVoted = true;
    }
  }
  for (u in json.parties[party].queue[song].upvoted) {
    if (json.parties[party].queue[song].upvoted[u].uid == uid) {
      alreadyVoted = true;
      firebase.database().ref("parties/" + party + "/queue/" + song).update({
        upvotes: upvotes
      });
      firebase.database().ref("parties/" + party + "/queue/" + song + "/upvoted/" + uid).remove()
        .then(function() {
          console.log("sucess");
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
      alreadyVoted = false;
    }
  }
  if (!alreadyVoted) {
    firebase.database().ref("parties/" + party + "/queue/" + song).update({
      downvotes: downvotes
    });
    firebase.database().ref("parties/" + party + "/queue/" + song + "/downvoted/" + uid).update({
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
