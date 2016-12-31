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

function init(context) {

   context.loadData(function(stationMap) {
      $("#stationMap").html(JSON.stringify(stationMap, null, 3));
      console.log(stationMap);
   });

   $("#navClearData").click(function() {
      chrome.storage.sync.clear();
      init(context);
   });

   $("#navLoadDefaults").click(function() {
      loadDefaultStations(function(stationMap) {
         console.log(stationMap);
         context.setStationMap(stationMap);
         context.saveData();
         init(context);
      });
   });

}

$(document).ready(function() {

   getContext(function(context) {
      init(context);
   });

});
