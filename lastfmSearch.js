var authDone = false;
var party;
//

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
  authDone = true;
});

function modalClicked() {
  $('#modal1').modal('open');
  httpGet();
}

function httpGets(){
  console.log("hi");

  var songName = $("#search").val();
  console.log(songName);
  var url = "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+songName+"&api_key=a1628eee06b5e44c3e2ba48cf52f07c7&limit=5&format=json"
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);

  $.getJSON(url, function(data){
    var counter = 0;
    $.each(data.results.trackmatches.track, function(i, item){
        console.log(counter);
        $('#result').append('<p>'+'<a id='+counter+' >'+ item.name +'</a>'+'</p>');

        $('#result').append('<ul class="collection">'+
        '<li class="collection-item avatar">'+
            '<img src="images/yuna.jpg" alt="" class="circle">'+
            '<span class="title">'+item.name+'</span>'+
            '<p>'+item.name+ '<br>'+
                +item.name+
            '</p>'+
        '</li>'+
      '</ul>');

        var x = document.getElementById(counter);
        x.addEventListener("click", function(){
            firebase.database().ref("parties/"+party+"/requests/"+item.mbid).update({
              name: item.name,
              artist: item.artist,
          });

        });
        counter = counter + 1;
    });
  });
  // $('#modal1').modal('open');
}
  $('.modal').modal();
