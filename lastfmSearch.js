function httpGet(){
  // console.log("heelo");
  var songName = $("#songName").val();
  var url = "http://ws.audioscrobbler.com/2.0/?method=track.search&track="+songName+"&api_key=a1628eee06b5e44c3e2ba48cf52f07c7&format=json"

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);

  var r = JSON.parse(xmlHttp, response);
  $.getJSON(url, function(data){
    var html = '';
    $.each(data.results.trackmatches.track, function(i, item){
      html +="<p>" + item.name + "\n" + "<p>";
    });
    $('#result').append(html);
  });
}
