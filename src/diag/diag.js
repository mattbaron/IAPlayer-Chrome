var stream = Array();
stream.pls = "https://somafm.com/sonicuniverse192.pls";
stream.m3u = "http://listen.abacus.fm/mozartpiano.m3u";
stream.direct = "";


function test() {
   var p = new AudioPlayer();
   p.prepare(stream.m3u, function() {
      console.log("ready()");
      p.play();
   });
}


$(document).ready(function() {

   getContext(function(context) {
      context.loadData(function(data) {
         $("#stationMap").html(JSON.stringify(data, null, 3));
      });
   });

   $("#testButton").click(function() {
      test();
   });

});
