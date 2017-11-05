var authDone = false;
var party;
//
$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

$("#searchForm").submit(function(event){
  $('#modal1').modal('open');
  httpGet();
  event.preventDefault();
});

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
  // window.location.assign('index.html');
  // }
  authDone = true;
});

function httpGet(){

  var songName = $("#search").val();
  var url = "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+songName+"&api_key=a1628eee06b5e44c3e2ba48cf52f07c7&limit=5&format=json"
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);

  // var r = JSON.parse(xmlHttp, results);
  $.getJSON(url, function(data){
    // var artistArr = [10];
    var counter = 0;
    $.each(data.results.trackmatches.track, function(i, item){
      // if($.inArray(item.artist, artistArr)){
        // console.log(artistArr[counter]);
        console.log(counter);
        $('#result').append('<a id='+counter+' >'+'</a>');
        var x = document.getElementById(counter);

        $('#result').append('<ul class="collection">'+
        '<li class="collection-item avatar">'+
            '<img src='+item.image.text+' alt="" class="circle">'+
            '<span class="title">'+item.name+'</span>'+
            '<p>'+item.artist+'<t>'+'<button id="s"'
        '</li>'+
      '</ul>');


        x.addEventListener("click", function(){
            firebase.database().ref("parties/"+party+"/requests/"+item.mbid).update({
              name: item.name,
              artist: item.artist,
          });

        });
        counter = counter + 1;
      // console.log(item);
      // }
      // artistArr[counter] = item.artist;
    });
    // $('#result').append(html);
  });
}

// function test(item){
//   console.log(item);
//   firebase.database().ref("parties/"+party+"/requests/"+item).update({
//     name: item
//   })
// }
